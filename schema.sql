DROP TABLE IF EXISTS courses;
CREATE TABLE IF NOT EXISTS courses (
    course_code TEXT PRIMARY KEY,
    year INTEGER,
    branch TEXT
);

DROP TABLE IF EXISTS schedule;
CREATE TABLE IF NOT EXISTS schedule (
    course_code TEXT,
    batch INTEGER,
    lab_set INTEGER,
    monday INTEGER,
    tuesday INTEGER,
    wednesday INTEGER,
    thursday INTEGER,
    friday INTEGER,
    PRIMARY KEY (course_code, batch)
);

DROP TABLE IF EXISTS cancelled;
CREATE TABLE IF NOT EXISTS cancelled (
    course_code TEXT,
    batch INTEGER,
    date TEXT,
    PRIMARY KEY (course_code, batch)
);

DROP TABLE IF EXISTS holidays;
CREATE TABLE IF NOT EXISTS holidays (
    date TEXT PRIMARY KEY
);

DROP TABLE IF EXISTS extra;
CREATE TABLE IF NOT EXISTS extra (
    course_code TEXT,
    batch INTEGER,
    date TEXT,
    PRIMARY KEY (course_code, batch)
);


/* Inserting data into the tables */

INSERT INTO courses (course_code, year, branch) VALUES ('ICS214', 2023, 'bc');
INSERT INTO courses (course_code, year, branch) VALUES ('ICS215', 2023, 'bc');

INSERT INTO schedule (course_code, batch, lab_set, monday, tuesday, wednesday, thursday, friday) VALUES ('ICS214', 3, 6, 2, 1, 0, 1, 0);
INSERT INTO schedule (course_code, batch, lab_set, monday, tuesday, wednesday, thursday, friday) VALUES ('ICS215', 3, 0, 0, 0, 1, 1, 0);

INSERT INTO holidays (date) VALUES ('2024-08-15');
