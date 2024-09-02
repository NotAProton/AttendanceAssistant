type HolidayRow = {
  date: string;
  days: number;
  reason: string;
};

export async function getHolidays(db: D1Database) {
  const holidayDates = (
    await db
      .prepare("SELECT date, days, reason FROM holidays")
      .all<HolidayRow>()
  ).results;

  return holidayDates;
}

type CoursesRow = {
  course_code: string;
};

export async function getCourses(db: D1Database, year: number, branch: string) {
  const courses = (
    await db
      .prepare(
        "SELECT course_code FROM courses WHERE (year = ?) AND (branch = ? OR branch = ? OR branch = ?)"
      )
      .bind(year, branch, branch?.slice(0, 2), branch?.slice(0, 1))
      .all<CoursesRow>()
  ).results;

  if (courses.length === 0) {
    throw new Error("No courses found");
  }

  return courses;
}

type ScheduleRow = {
  course_code: string;
  batch: number;
  lab_set: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
};

export async function getSchedule(
  db: D1Database,
  course: string,
  batch: number,
  set: number
) {
  const schedule = await db
    .prepare(
      "SELECT * FROM schedule WHERE (course_code = ? AND (batch = ? OR batch = 0)) AND (lab_set = ? OR lab_set = 0)"
    )
    .bind(course, batch, set)
    .first<ScheduleRow>();

  if (!schedule) {
    throw new Error("No schedule found");
  }

  return schedule;
}

type CancelledClassesRow = {
  date: string;
};

export async function getCancelledClasses(
  db: D1Database,
  course: string,
  batch: number,
  set: number
) {
  const cancelledClasses = (
    await db
      .prepare(
        "SELECT date FROM cancelled WHERE course_code = ? AND batch = ? AND (lab_set = 0 OR lab_set = ?)"
      )
      .bind(course, batch, set)
      .all<CancelledClassesRow>()
  ).results;

  return cancelledClasses;
}

type ExtraClassesRow = {
  date: string;
};

export async function getExtraClasses(
  db: D1Database,
  course: string,
  batch: number,
  set: number
) {
  const extraClasses = (
    await db
      .prepare(
        "SELECT date FROM extra WHERE course_code = ? AND batch = ? AND (lab_set = 0 OR lab_set = ?)"
      )
      .bind(course, batch, set)
      .all<ExtraClassesRow>()
  ).results;

  return extraClasses;
}
