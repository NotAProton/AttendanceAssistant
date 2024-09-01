"use client";

import { useState } from "react";
import NumberInput from "./NumberInput";
import { Holidays } from "../api/data/route";
import { NegativeClass } from "./dash";
import { Tooltip } from "@mantine/core";

type CourseDetailsProps = {
  classesConducted: number;
  classesCancelled: NegativeClass[];
  extraClasses: Date[];
  classesRemaining: number;
  classesMissed: number;
  onClassesMissedChange: (classesMissed: number) => void;
};

function roundToTwo(num: Number) {
  return +(Math.round(Number(num + "e+2")) + "e-2");
}

export default function CourseDetails(props: CourseDetailsProps) {
  const classesAttended = props.classesConducted - props.classesMissed;
  const canSkip = Math.floor(
    (props.classesRemaining + props.classesConducted) * 0.2 -
      props.classesMissed
  );
  return (
    <div
      className="bg-slate-100 p-4 text-zi
    nc-600 font-semibold lg:pr-10 rounded-b-xl border-2 border-t-0 border-slate-200"
    >
      <div className="grid sm:grid-rows-1 sm:grid-flow-col justify-between items-center gap-3 pb-1">
        <div className="w-fit">
          <div className="border-b-2 border-slate-400 grid grid-rows-1 grid-flow-col justify-between items-center gap-3 pb-1">
            <div>Classes you attended: </div>
            <div>
              <NumberInput
                initialValue={classesAttended}
                onChange={(v) => {
                  props.onClassesMissedChange(props.classesConducted - v);
                }}
                max={props.classesConducted}
              />
            </div>
          </div>
          <div className="pt-1 flex flex-row items-center">
            <span>Classes conducted: </span>
            <span className="grow text-center">{props.classesConducted}</span>
          </div>
        </div>
        <div>
          Your current attendance:{" "}
          <span className="text-textc">
            {roundToTwo((classesAttended / props.classesConducted) * 100)}%
          </span>
        </div>
      </div>

      <div className="flex flex-row flex-wrap mt-8 gap-1">
        {props.classesCancelled && props.classesCancelled.length > 0 ? (
          <>
            <div className="w-fit">Classes Cancelled: </div>
            {props.classesCancelled.map((c) => (
              <NegativeDatePill
                key={
                  c.type === "rangedHoliday"
                    ? c.start.toISOString()
                    : c.date.toISOString()
                }
                negativeClass={c}
              />
            ))}
          </>
        ) : (
          <div>No classes cancelled</div>
        )}
      </div>

      <div className="grid sm:grid-rows-1 sm:grid-flow-col justify-start items-center gap-1">
        {props.extraClasses && props.extraClasses.length > 0 ? (
          <>
            <div className="w-fit">Extra Classes: </div>
            <div className="flex gap-1">
              {props.extraClasses.map((date) => (
                <DatePill key={date.toISOString()} date={date} />
              ))}
            </div>
          </>
        ) : (
          "No extra classes"
        )}
      </div>
      <a href="/report" className="text-xs underline decoration-dotted">
        Report incorrect data
      </a>

      <div className="mt-8">
        <div>Classes remaining this semester: {props.classesRemaining}</div>
        <div className="text-textc">
          Your maximum attendance can be{" "}
          <span className="text-primary">
            {Math.round(
              ((classesAttended + props.classesRemaining) /
                (props.classesConducted + props.classesRemaining)) *
                100
            )}
            %
          </span>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 gap-y-1 sm:gap-y-0  mt-8 w-fit">
        {canSkip >= 0 ? (
          <>
            <div className="lg:col-span-2 text-textc">
              You need to attend{" "}
              <span className="text-primary">
                {Math.ceil(
                  (props.classesRemaining + props.classesConducted) * 0.8
                ) - classesAttended}{" "}
                more classes
              </span>{" "}
              to stay just above 80%
            </div>
            <div className="text-textc">
              You can miss{" "}
              <span className="text-primary">{canSkip} more classes</span>
            </div>
            <div className="text-textc">
              Expected attendance{" "}
              <span className="text-primary">
                {roundToTwo(
                  Math.ceil(
                    (props.classesRemaining + props.classesConducted) * 0.8
                  ) /
                    (props.classesConducted + props.classesRemaining)
                ) * 100}
                %
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="text-textc">
              There are not enough classes left to make up. <br />
              Hope for some extra 🤞
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function NegativeDatePill({ negativeClass }: { negativeClass: NegativeClass }) {
  if (negativeClass.type === "cancelled") {
    return (
      <Tooltip label="Cancelled">
        <div className="rounded-md text-neutral-600 bg-zinc-300 justify-center p-1 py-0.5 text-sm">
          <FormattedDate date={negativeClass.date} />
        </div>
      </Tooltip>
    );
  } else if (negativeClass.type === "holiday") {
    return (
      <Tooltip label={negativeClass.reason}>
        <div className="rounded-md text-neutral-600 bg-zinc-300 justify-center p-1 py-0.5 text-sm">
          <FormattedDate date={negativeClass.date} />
        </div>
      </Tooltip>
    );
  } else if (negativeClass.type === "rangedHoliday") {
    return (
      <Tooltip label={negativeClass.reason}>
        <div className="rounded-md text-neutral-600 bg-zinc-300 justify-center p-1 py-0.5 text-sm">
          <FormattedDate date={negativeClass.start} /> -{" "}
          <FormattedDate date={negativeClass.end} />
        </div>
      </Tooltip>
    );
  }
}

function DatePill({ date }: { date: Date }) {
  return (
    <div className="rounded-md text-neutral-600 bg-zinc-300 justify-center p-1 py-0.5 text-sm">
      <FormattedDate date={date} />
    </div>
  );
}

function FormattedDate({ date }: { date: Date }) {
  return (
    <span>
      {date.getDate()} {date.toLocaleString("en-US", { month: "short" })}
    </span>
  );
}
