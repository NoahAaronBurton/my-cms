INSERT INTO department (id,name) -- primarily intended for development and testing purposes. It's a convenient way to reset or recreate a database in non-production environments like development, testing, or local development environments --
VALUES (001,"Finance"),
        (002, "Legal"),
        (003, "Sales");

INSERT INTO role (id,title, salary, department_id)
VALUES  (325,"Account Executive", 80000, 003),
        (250,"Consulting Attorney", 100000, 002),
        (100,"CFO", 120000, 001),
        (300, "Sales Manager", 110000, 003),
        (200, "Legal Admin", 125000, 002),
        (130, "Accountant", 75000, 001);
INSERT INTO employee (id, first_name, last_name,role_id,manager_id)
VALUES  (4574, "Bill","Withers", 300, NULL),
        (2578, "B.B.", "King", 325, 4574);