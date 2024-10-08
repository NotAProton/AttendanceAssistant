"use client";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Accordion, Loader } from "@mantine/core";

import { MantineProvider } from "@mantine/core";

import type {
  ResponseCourse,
  Holidays,
  rangedHolidays,
} from "@/app/api/data/route";
import CourseDetails from "./courseDetails";
import { useEffect, useState } from "react";
import { useDataStore } from "../../lib/store";
import getCourseName from "../../lib/courseNames";

const queryClient = new QueryClient();

export default function Dashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Courses />
      </MantineProvider>
    </QueryClientProvider>
  );
}

async function fetchCourses(lastRollNumber: string) {
  const year = parseInt(lastRollNumber.slice(0, 4), 10);
  const branch = lastRollNumber.slice(4, 7);
  const roll = parseInt(lastRollNumber.slice(7), 10);
  if (isNaN(year) || isNaN(roll)) {
    return [];
  }
  const res = await fetch(
    `/api/data?year=${year}&branch=${branch}&roll=${roll}`
  );
  return res.json<ResponseCourse[]>();
}

interface Attendance {
  subject: string;
  classesMissed: number;
}

// use for display of -ve classes
export type NegativeClass =
  | {
      type: "holiday";
      date: Date;
      reason: string;
    }
  | {
      type: "rangedHoliday";
      start: Date;
      reason: string;
      end: Date;
    }
  | {
      type: "cancelled";
      date: Date;
    };

function getNegativeClasses(
  holidays: Holidays[],
  holidayRanges: rangedHolidays[],
  classesCancelled: Date[]
): NegativeClass[] {
  const negativeClasses: NegativeClass[] = [];

  classesCancelled.forEach((date) => {
    negativeClasses.push({
      type: "cancelled",
      date: new Date(date),
    });
  });

  holidayRanges.forEach((holiday) => {
    negativeClasses.push({
      type: "rangedHoliday",
      start: new Date(holiday.start),
      end: new Date(holiday.end),
      reason: holiday.reason,
    });
  });

  holidays.forEach((holiday) => {
    // dont include if already included in ranged holidays
    if (
      !holidayRanges.find(
        (rangedHoliday) =>
          rangedHoliday.start <= holiday.date &&
          rangedHoliday.end >= holiday.date
      )
    ) {
      negativeClasses.push({
        type: "holiday",
        date: new Date(holiday.date),
        reason: holiday.reason,
      });
    }
  });

  // sort by date or start date
  negativeClasses.sort((a, b) => {
    if (a.type === "cancelled" && b.type === "cancelled") {
      return a.date.getTime() - b.date.getTime();
    } else if (a.type === "holiday" && b.type === "holiday") {
      return a.date.getTime() - b.date.getTime();
    } else if (a.type === "rangedHoliday" && b.type === "rangedHoliday") {
      return a.start.getTime() - b.start.getTime();
    } else if (a.type === "cancelled") {
      return -1;
    } else if (a.type === "holiday" && b.type === "rangedHoliday") {
      return -1;
    } else {
      return 1;
    }
  });

  return negativeClasses;
}

function Courses() {
  const { lastRollNumber, users, addUser, updateUserAttendance } = useDataStore(
    (state) => ({
      lastRollNumber: state.lastRollNumber,
      users: state.users,
      addUser: state.addUser,
      updateUserAttendance: state.updateUserAttendance,
    })
  );

  const { data: courses, isLoading } = useQuery<ResponseCourse[]>({
    queryKey: ["courses", lastRollNumber],
    queryFn: () => fetchCourses(lastRollNumber),
  });

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedUserAttendance, setSelectedUserAttendance] = useState<
    Attendance[]
  >([]);

  useEffect(() => {
    if (courses && lastRollNumber) {
      const currentUser = users.find(
        (user) => user.rollNumber === lastRollNumber
      );

      if (!currentUser) {
        addUser({
          rollNumber: lastRollNumber,
          attendance: courses.map((course) => ({
            subject: course.courseCode,
            classesMissed: 0,
          })),
        });
      } else {
        setSelectedUserAttendance(currentUser.attendance);
      }
    }
  }, [courses, lastRollNumber, users, addUser]);

  useEffect(() => {
    const currentUser = users.find(
      (user) => user.rollNumber === lastRollNumber
    );
    if (currentUser) {
      setSelectedUserAttendance(currentUser.attendance);
    }
  }, [lastRollNumber, users]);

  const items = courses?.map((course) => (
    <Accordion.Item
      key={course.courseCode}
      title={course.courseCode}
      value={course.courseCode}
    >
      <Accordion.Control
        className={`bg-[#e6eef6] hover:bg-[#d3e1f4] border-0 rounded-xl mt-1 text-xl transition-all${
          selectedCourse == course.courseCode ? "rounded-b-none" : ""
        }`}
      >
        {course.courseCode}:{" "}
        <span className="capitalize">{getCourseName(course.courseCode)}</span>
      </Accordion.Control>
      <Accordion.Panel classNames={{ content: "p-0" }}>
        <CourseDetails
          classesConducted={course.classesCompleted}
          classesCancelled={getNegativeClasses(
            course.holidays,
            course.rangedHolidays,
            course.classesCancelled
          )}
          extraClasses={[]}
          classesRemaining={course.classesRemaining}
          classesMissed={
            selectedUserAttendance.find(
              (attendance) => attendance.subject === course.courseCode
            )?.classesMissed || 0
          }
          onClassesMissedChange={(v) => {
            updateUserAttendance(lastRollNumber, course.courseCode, v);
          }}
        />
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader color="blue" type="dots" size="xl" />;
        </div>
      ) : (
        <Accordion
          classNames={{ item: "border-0 rounded-t-xl" }}
          onChange={setSelectedCourse}
          defaultValue={courses?.[0].courseCode}
        >
          {items}
        </Accordion>
      )}
    </div>
  );
}
