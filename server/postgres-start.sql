-- Note: First create a database and then connect to it.
-- This can be done either through psql (terminal) or pgAdmin (GUI)
-- CREATE DATABASE drrs;
-- \c drrs

CREATE TABLE department
(
    dept_id   SERIAL PRIMARY KEY NOT NULL,
    dept_name VARCHAR(50)        NOT NULL
);

INSERT INTO department (dept_name)
VALUES ('Science and Technology'),
       ('General'),
       ('Senior High School');

SELECT *
FROM department;

CREATE TABLE room
(
    room_id      SERIAL PRIMARY KEY NOT NULL,
    room_name    VARCHAR(50)        NOT NULL,
    room_avail   BOOLEAN DEFAULT TRUE,

    -- foreign key
    room_dept_id INT                NOT NULL REFERENCES department (dept_id)
);

INSERT INTO room (room_name, room_dept_id)
VALUES ('Sci tech room 1', 1),
       ('Sci tech room 2', 1),
       ('Gen room 1', 2),
       ('SHS room 1', 3);

SELECT *
FROM room;

SELECT *
FROM room,
     department
WHERE dept_id = room_dept_id;

CREATE TABLE librarian
(
    lib_id      SERIAL PRIMARY KEY NOT NULL,
    lib_email   VARCHAR(50)        NOT NULL,
    lib_fname   VARCHAR(50)        NOT NULL,
    lib_lname   VARCHAR(50)        NOT NULL,

    -- foreign key
    lib_dept_id INT                NOT NULL REFERENCES department (dept_id)
);

INSERT INTO librarian (lib_email, lib_fname, lib_lname, lib_dept_id)
VALUES ('kendrick@gmail.com', 'Kendrick', 'Duckworth', 1),
       ('aubrey@gmail.com', 'Aubrey', 'Graham', 2),
       ('jahseh@gmail.com', 'Jahseh', 'Onfroy', 3);

SELECT *
FROM librarian,
     department
WHERE dept_id = lib_dept_id;

CREATE TABLE admin
(
    adm_id      SERIAL PRIMARY KEY NOT NULL,
    adm_email   VARCHAR(50)        NOT NULL,
    adm_fname   VARCHAR(50)        NOT NULL,
    adm_lname   VARCHAR(50)        NOT NULL,

    -- foreign key
    adm_dept_id INT                NOT NULL REFERENCES department (dept_id)
);

INSERT INTO admin (adm_email, adm_fname, adm_lname, adm_dept_id)
VALUES ('tupac@gmail.com', 'Tupac', 'Shakur', 1);

SELECT *
FROM admin,
     department
WHERE dept_id = adm_dept_id;

CREATE TABLE log
(
    log_id         SERIAL PRIMARY KEY NOT NULL,
    log_date       DATE               NOT NULL,
    log_no_pax     INT                NOT NULL,
    log_purp       VARCHAR(50)        NOT NULL DEFAULT 'N/A',
    log_start_time TIME               NOT NULL,
    log_end_time   TIME               NOT NULL,
    log_rcpt       VARCHAR(50)        NOT NULL,
    log_stu_rept   VARCHAR(100)       NOT NULL,

    -- foreign keys
    log_room_id    INT                NOT NULL REFERENCES room (room_id),
    log_lib_id     INT                NOT NULL REFERENCES librarian (lib_id)
);

-- without log purpose
INSERT INTO log (log_date, log_no_pax, log_start_time, log_end_time, log_rcpt, log_stu_rept, log_room_id,
                 log_lib_id)
VALUES ('2024-01-28', 5, '12:00:00', '14:00:00', 'qwerty123', 'Jacques Webster', 1, 1);

UPDATE room SET room_avail = FALSE WHERE room_id = 1;

SELECT * FROM room;

-- with log purpose included
INSERT INTO log (log_date, log_no_pax, log_purp, log_start_time, log_end_time, log_rcpt, log_stu_rept, log_room_id,
                 log_lib_id)
VALUES ('2024-01-28', 4, 'gucci ganging', '13:00:00', '15:00:00', 'iop456', 'Gazzy Garcia', 3, 3);

SELECT * FROM log;