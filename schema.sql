-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS extra;
DROP TABLE IF EXISTS cancelled;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS holidays;
DROP TABLE IF EXISTS telemetry;

-- Courses table
CREATE TABLE courses (
    course_code TEXT PRIMARY KEY,
    year INTEGER NOT NULL,
    branch TEXT NOT NULL
);


-- Schedule table
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


-- Cancelled table
CREATE TABLE cancelled (
    course_code TEXT NOT NULL,
    batch INTEGER NOT NULL,
    lab_set INTEGER NOT NULL DEFAULT 0,
    date TEXT NOT NULL,
    PRIMARY KEY (course_code, batch, date),
    FOREIGN KEY (course_code) REFERENCES courses(course_code)
);

-- Holidays table
CREATE TABLE holidays (
    date TEXT PRIMARY KEY,
    days INTEGER NOT NULL DEFAULT 1,
    reason TEXT NOT NULL DEFAULT 'Holiday'
);

-- Add sample data to holidays table
INSERT INTO holidays (date, days, reason)
VALUES 
    ('2024-08-15', 1, 'Independence Day'),
    ('2024-11-18', 13, 'End Semester Exams');

-- Extra table
CREATE TABLE extra (
    course_code TEXT NOT NULL,
    batch INTEGER NOT NULL,
    lab_set INTEGER NOT NULL,
    date TEXT NOT NULL,
    PRIMARY KEY (course_code, batch, date),
    FOREIGN KEY (course_code, batch, lab_set) REFERENCES schedule(course_code, batch, lab_set)
);


CREATE TABLE IF NOT EXISTS telemetry (
    time TEXT,
    trigger TEXT,
    ip TEXT,
    ua TEXT,
    client_id TEXT,
    value TEXT
);
