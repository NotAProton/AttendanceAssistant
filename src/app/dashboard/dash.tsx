"use client";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Accordion } from "@mantine/core";

import { MantineProvider } from "@mantine/core";

import type { ResponseCourse } from "@/app/api/data/route";
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

async function dummyFetchCourses() {
  const res = {
    json: async () => [
      {
        courseCode: "CS101",
        classesCompleted: 10,
        classesRemaining: 20,
        classesCancelled: 2,
        extraClasses: 0,
        holidays: [
          { date: "2023-09-01" },
          { date: "2023-09-02" },
          { date: "2023-09-03" },
        ],
      },
      {
        courseCode: "CS102",
        classesCompleted: 15,
        classesRemaining: 15,
        classesCancelled: 0,
        extraClasses: 0,
        holidays: [],
      },
    ],
  };
  return res.json();
}

interface Attendance {
  subject: string;
  classesMissed: number;
}

interface User {
  rollNumber: string;
  attendance: Attendance[];
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
          classesCancelled={course.holidays.map(
            (holiday) => new Date(holiday.date)
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
