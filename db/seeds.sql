INSERT INTO department (id,name) -- primarily intended for development and testing purposes. It's a convenient way to reset or recreate a database in non-production environments like development, testing, or local development environments --
VALUES (001,"Finance"),
        (002, "Legal"),
        (003, "Sales");

INSERT INTO role (id,title, salary, department_id)
VALUES  (325,"Account executive", 80000, 003),
        (200,"Consulting Attorney", 100000, 002),
        (100,"CFO", 120000, 001);