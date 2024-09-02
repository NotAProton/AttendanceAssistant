"use client";
import { useState } from "react";
import {
  MantineProvider,
  Textarea,
  Button,
  Text,
  TextInput,
} from "@mantine/core";

export default function Box() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [batch, setBatch] = useState("");

  const parseTimetable = () => {
    // Add new line after every day if not present
    let newValue = value.replace(/(Mon|Tue|Wed|Thu|Fri)/g, "$1\n");
    console.log(newValue);

    let lines = newValue.split("\n").filter((line) => line.trim());
    lines = lines.map((line) => line.trim());
    console.log(lines);
    const courseCounts: Record<string, Record<string, number>> = {};
    let currentDay: string = "";

    lines.forEach((line) => {
      if (["Mon", "Tue", "Wed", "Thu", "Fri"].includes(line)) {
        currentDay = line;
      } else if (line.match(/[A-Z]{3} \d{3}/)) {
        const matched = line.match(/([A-Z]{3} \d{3})/)![0];
        if (!courseCounts[matched]) {
          courseCounts[matched] = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 };
        }
        if (currentDay) {
          courseCounts[matched][currentDay]++;
        }
      }
    });

    const resultStr = Object.keys(courseCounts)
      .map((course) => {
        if (course.match("IPT")) {
          return null;
        }
        const counts = Object.values(courseCounts[course]).join(", ");
        // Check if "SET" is mentioned in the same line as the course
        const isRed = lines.some(
          (line) => line.includes(course) && line.includes("SET")
        );
        return isRed
          ? `<span style="color: red">${course}: ${counts}</span>`
          : `INSERT INTO schedule (course_code, batch, lab_set, monday, tuesday, wednesday, thursday, friday) VALUES ('${course}', ${batch}, 0, ${counts});`;
      })
      .join("<br/>");

    setResult(resultStr);
  };

  return (
    <MantineProvider>
      <Textarea
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder="Paste timetable here"
        resize="both"
        minRows={10}
      />
      <TextInput
        value={batch}
        onChange={(event) => setBatch(event.currentTarget.value)}
        placeholder="batch"
        mt="md"
      />
      <Button onClick={parseTimetable} mt="md">
        Parse Timetable
      </Button>
      <Text
        mt="md"
        size="sm"
        component="div"
        dangerouslySetInnerHTML={{ __html: result }}
      />
    </MantineProvider>
  );
}
