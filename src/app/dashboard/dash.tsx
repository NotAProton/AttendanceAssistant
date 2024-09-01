"use client";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Accordion } from "@mantine/core";

import { MantineProvider } from "@mantine/core";

import type {
  ResponseCourse,
  Holidays,
  rangedHolidays,
} from "@/app/api/data/route";
import CourseDetails from "./courseDetails";
import { use, useEffect, useState } from "react";
import { useDataStore } from "../store";

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

async function fetchCourses() {
  const res = await fetch("/api/data?year=2023&branch=bcy&roll=48");
  return res.json<ResponseCourse[]>();
}

interface Attendance {
  subject: string;
  classesMissed: number;
}

interface User {
  rollNumber: string;
  attendance: Attendance[];
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

  holidays.forEach((holiday) => {
    negativeClasses.push({
      type: "holiday",
      date: new Date(holiday.date),
      reason: holiday.reason,
    });
  });

  holidayRanges.forEach((holiday) => {
    negativeClasses.push({
      type: "rangedHoliday",
      start: holiday.start,
      end: holiday.end,
      reason: "Ranged Holiday",
    });
  });

  classesCancelled.forEach((date) => {
    negativeClasses.push({
      type: "cancelled",
      date,
    });
  });

  return negativeClasses;
}

function Courses() {
  const { data: courses, isLoading } = useQuery<ResponseCourse[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { lastRollNumber, users, addUser, updateUserAttendance } = useDataStore(
    (state) => ({
      lastRollNumber: state.lastRollNumber,
      users: state.users,
      addUser: state.addUser,
      updateUserAttendance: state.updateUserAttendance,
    })
  );

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
        className={`bg-[#e6eef6] hover:bg-[#d3e1f4] border-0 rounded-xl mt-1 text-xl transition-all ${
          selectedCourse == course.courseCode ? "rounded-b-none" : ""
        }`}
      >
        {course.courseCode}
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
        <p>Loading...</p>
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
