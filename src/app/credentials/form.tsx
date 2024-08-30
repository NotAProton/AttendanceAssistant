"use client";

import { useForm } from "@mantine/form";
import {
  Select,
  TextInput,
  PasswordInput,
  Button,
  MantineProvider,
} from "@mantine/core";
import { useDataStore } from "../store";

export default function Form() {
  const form = useForm({
    initialValues: {
      year: "",
      branchCode: "",
      rollNumber: "",
      //password: "",
    },
    validate: {
      year: (value) => (value ? null : "Year is required"),
      branchCode: (value) => (value ? null : "Branch Code is required"),
      rollNumber: (value) =>
        parseInt(value) > 0 ? null : "Roll Number is required",
      //password: (value) => (value ? null : "Password is required"),
    },
  });

  const setLastRollNumber = useDataStore((state) => state.setLastRollNumber);

  const handleSubmit = form.onSubmit((values) => {
    setLastRollNumber(
      values.year + values.branchCode + values.rollNumber.padStart(4, "0")
    );
    if (window !== undefined) {
      window.location.href = "/dashboard";
    }
  });

  return (
    <MantineProvider>
      <form onSubmit={handleSubmit} className="p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Select
              label="Year"
              placeholder="2023"
              data={["2023"]}
              className="rounded-md"
              size="md"
              {...form.getInputProps("year")}
            />
            <Select
              label="Branch Code"
              placeholder="BXX"
              data={["BCD", "BCS", "BCY", "BEC"]}
              size="md"
              className=""
              {...form.getInputProps("branchCode")}
            />
            <TextInput
              label="Roll Number"
              type="number"
              size="md"
              placeholder="00XX"
              {...form.getInputProps("rollNumber")}
            />
          </div>
          {/* <PasswordInput
            label="LMS Password"
            size="md"
            placeholder="Enter your LMS password"
            {...form.getInputProps("password")}
          /> */}
          <p className="text-sm text-gray-600 mt-6">
            Your roll number is only used to fetch your courses.
          </p>
          <Button
            type="submit"
            className="text-lg bg-primary text-white hover:bg-blue-500 transition-all w-fit self-center shadow-sm"
          >
            Submit
          </Button>
        </div>
      </form>
    </MantineProvider>
  );
}
