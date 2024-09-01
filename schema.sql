-- Courses table
DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
    course_code TEXT PRIMARY KEY,
    year INTEGER NOT NULL,
    branch TEXT NOT NULL
);

-- Add sample data to courses table
INSERT INTO courses (course_code, year, branch)
VALUES 
    ('ICS214', 2023, 'bc'),
    ('ICS215', 2023, 'bc');

-- Schedule table
DROP TABLE IF EXISTS schedule;
CREATE TABLE schedule (
    course_code TEXT NOT NULL,
    batch INTEGER NOT NULL,
    lab_set INTEGER NOT NULL DEFAULT 0,
    monday INTEGER NOT NULL DEFAULT 0,
    tuesday INTEGER NOT NULL DEFAULT 0,
    wednesday INTEGER NOT NULL DEFAULT 0,
    thursday INTEGER NOT NULL DEFAULT 0,
    friday INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (course_code, batch, lab_set),
    FOREIGN KEY (course_code) REFERENCES courses(course_code)
);

-- Add sample data to schedule table
INSERT INTO schedule (course_code, batch, lab_set, monday, tuesday, thursday)
VALUES ('ICS214', 3, 6, 2, 1, 1);

INSERT INTO schedule (course_code, batch, lab_set, monday, tuesday, wednesday, thursday, friday)
VALUES ('ICS215', 3, 0, 0, 0, 1, 1, 0);

-- Cancelled table
DROP TABLE IF EXISTS cancelled;
CREATE TABLE cancelled (
    course_code TEXT NOT NULL,
    batch INTEGER NOT NULL,
    lab_set INTEGER NOT NULL DEFAULT 0,
    date TEXT NOT NULL,
    PRIMARY KEY (course_code, batch, date),
    FOREIGN KEY (course_code) REFERENCES courses(course_code)
);

-- Holidays table
DROP TABLE IF EXISTS holidays;
CREATE TABLE holidays (
    date TEXT PRIMARY KEY,
    days INTEGER NOT NULL DEFAULT 1,
    reason TEXT NOT NULL DEFAULT 'Holiday'
);

-- Add sample data to holidays table
INSERT INTO holidays (date, days, reason)
VALUES ('2024-08-15', 1, 'Independence Day');

-- Extra table
DROP TABLE IF EXISTS extra;
CREATE TABLE extra (
    course_code TEXT NOT NULL,
    batch INTEGER NOT NULL,
    lab_set INTEGER NOT NULL,
    date TEXT NOT NULL,
    PRIMARY KEY (course_code, batch, date),
    FOREIGN KEY (course_code, batch, lab_set) REFERENCES schedule(course_code, batch, lab_set)
);
