import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import {
  getCancelledClasses,
  getCourses,
  getExtraClasses,
  getHolidays,
  getSchedule,
} from "./sql";
import { getSet } from "./sets";

export const runtime = "edge";

function countWeekDays(days: number[], d0: Date, d1: Date) {
  var ndays =
    1 + Math.round((d1.getTime() - d0.getTime()) / (24 * 3600 * 1000));
  var sum = function (a: number, b: number) {
    return a + Math.floor((ndays + ((d0.getDay() + 6 - b) % 7)) / 7);
  };
  return days.reduce(sum, 0);
}

export interface Holidays {
  date: Date;
  reason: string;
  weekday: number;
}
export type rangedHolidays = {
  start: Date;
  end: Date;
  reason: string;
};

export interface ResponseCourse {
  courseCode: string;
  classesCompleted: number;
  classesRemaining: number;
  holidays: Holidays[];
  rangedHolidays: rangedHolidays[];
  classesCancelled: Date[];
  extraClasses: Date[];
}

function parseUrlParams(url: string): {
  year: number;
  branch: string;
  roll: number;
} {
  const params = new URLSearchParams(new URL(url).search);

  const year = parseInt(params.get("year") || "", 10);
  const branch = (params.get("branch") || "").toLowerCase();
  const roll = parseInt(params.get("roll") || "", 10);

  if (isNaN(year) || year < 2020 || year > 2024) {
    throw new Error("Year must be an integer between 2020 and 2024");
  }

  if (!["bcd", "bcs", "bcy", "bec"].includes(branch)) {
    throw new Error("Branch must be either bcd, bcs, bcy, or bec");
  }

  if (isNaN(roll) || roll < 1 || roll > 550) {
    throw new Error("Roll must be an integer between 1 and 550");
  }

  return { year, branch, roll };
}

export async function GET(request: NextRequest) {
  // In the edge runtime you can use Bindings that are available in your application
  // (for more details see:
  //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
  //    - https://developers.cloudflare.com/pages/functions/bindings/
  // )
  //
  // KV Example:
  // const myKv = getRequestContext().env.MY_KV_NAMESPACE
  // await myKv.put('suffix', ' from a KV store!')
  // const suffix = await myKv.get('suffix')
  // responseText += suffix

  // get year, branch and bactch from request
  let year, branch, roll;

  try {
    ({ year, branch, roll } = parseUrlParams(request.url));
  } catch (e: any) {
    return new Response(e.message, { status: 400 });
  }

  const batch = roll % 3 || 3;

  let classesStartedDate = new Date("2024-08-01");
  let classesEnd = new Date("2024-11-30");
  let weekdaysDone = [];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  for (let i = 1; i < 6; i++) {
    weekdaysDone.push(countWeekDays([i], classesStartedDate, yesterday));
  }

  let weekdaysLeft = [];
  for (let i = 1; i < 6; i++) {
    weekdaysLeft.push(countWeekDays([i], new Date(), classesEnd));
  }
  console.log(weekdaysDone, weekdaysLeft);
  // fetch courses of the year, branch from db
  const db = getRequestContext().env.DB;

  // get holidaysDates used for display, holidays used for calculation
  const holidayDates = await getHolidays(db);
  const holidays: Holidays[] = [];
  holidayDates.forEach((holiday) => {
    if (holiday.days === 1) {
      holidays.push({
        date: new Date(holiday.date),
        weekday: new Date(holiday.date).getDay(),
        reason: holiday.reason,
      });
    } else {
      let startDate = new Date(holiday.date);
      for (let i = 0; i < holiday.days; i++) {
        holidays.push({
          date: new Date(startDate),
          weekday: startDate.getDay(),
          reason: holiday.reason,
        });
        startDate.setDate(startDate.getDate() + 1);
      }
    }
  });

  const rangedHolidays: rangedHolidays[] = [];

  holidayDates.forEach((holiday) => {
    if (holiday.days !== 1) {
      let startDate = new Date(holiday.date);
      let endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + holiday.days - 1);
      rangedHolidays.push({
        start: startDate,
        end: endDate,
        reason: holiday.reason,
      });
    }
  });

  let courses;
  try {
    courses = await getCourses(db, year, branch);
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }

  let responseCourses: ResponseCourse[] = [];
  const set = getSet(branch, batch, roll);
  if (!set) {
    return new Response("Invalid roll number", { status: 400 });
  }

  for (let course of courses) {
    let schedule;
    try {
      schedule = await getSchedule(db, course.course_code, batch, set);
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ] as const;
    type Day = (typeof days)[number];

    let classesCompleted = days.reduce(
      (acc, day) => acc + schedule[day] * weekdaysDone[days.indexOf(day)],
      0
    );

    let classesRemaining = days.reduce(
      (acc, day) => acc + schedule[day] * weekdaysLeft[days.indexOf(day)],
      0
    );

    const classesCancelled = await getCancelledClasses(
      db,
      course.course_code,
      batch,
      set
    );

    for (let cancelledClass of classesCancelled) {
      const date = new Date(cancelledClass.date);
      if (date < yesterday) {
        classesCompleted--;
      } else {
        classesRemaining--;
      }
    }
    const classesOnHolidays = holidays.filter(
      (holiday) => schedule[days[holiday.weekday - 1]] > 0
    );
    console.log(classesOnHolidays);

    for (let holiday of classesOnHolidays) {
      if (holiday.date < yesterday) {
        classesCompleted--;
      } else {
        classesRemaining--;
      }
    }

    const extraClasses = await getExtraClasses(
      db,
      course.course_code,
      batch,
      set
    );

    for (let extraClass of extraClasses) {
      const date = new Date(extraClass.date);
      if (date < yesterday) {
        classesCompleted++;
      } else {
        classesRemaining++;
      }
    }

    responseCourses.push({
      courseCode: course.course_code,
      classesCompleted,
      classesRemaining,
      holidays: classesOnHolidays,
      rangedHolidays,
      classesCancelled: classesCancelled.map(
        (cancelledClass) => new Date(cancelledClass.date)
      ),
      extraClasses: extraClasses.map((extraClass) => new Date(extraClass.date)),
    });

    //Get schedule from db of the course and batch
    // calculate classes completed by multiplying the number of weekdays in the schedule with the number of weekdays passed since classes started and today
    // calculate classes remaining by multiplying the number of weekdays in the schedule with the number of weekdays remaining till the end of the schedule
    // fetch holidays from db
    // calculate the weekday of the holiday and if it is before today, subtract it from classes completed
    // if it is after today, subtract it from classes remaining
    // fetch cancelled classes from db
    // subtract the number of cancelled classes from classes completed
    // fetch extra classes from db
    // check if the extra class is before today, add it to classes completed
    // if it is after today, add it to classes remaining
  }

  return new Response(JSON.stringify(responseCourses));
}
