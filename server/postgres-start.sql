-- Note: First create a database and then connect to it.
-- This can be done either through psql (terminal) or pgAdmin (GUI)
-- CREATE DATABASE drrs;
-- \c drrs

CREATE TABLE department
(
    dept_id  SERIAL PRIMARY KEY NOT NULL,
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
    room_id SERIAL PRIMARY KEY NOT NULL,
    room_name VARCHAR(50) NOT NULL,
    room_avail BOOLEAN DEFAULT TRUE,

    -- Connecting attributes
    room_dept_id INT references department(dept_id)
);

INSERT INTO room (room_name, room_dept_id)
VALUES ('Sci tech room 1', 1),
       ('Sci tech room 2', 1),
       ('Gen room 1', 2),
       ('SHS room 1', 3);

SELECT * FROM room;