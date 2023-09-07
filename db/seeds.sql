INSERT INTO department (id,name) -- primarily intended for development and testing purposes. It's a convenient way to reset or recreate a database in non-production environments like development, testing, or local development environments --
VALUES (1,"Finance"),
        (2, "Legal"),
        (3, "Sales");

INSERT INTO role (id,title, salary, department_id)
VALUES  (325,"Account Executive", 80000, 003),
        (250,"Consulting Attorney", 100000, 002),
        (100,"CFO", 120000, 001),
        (300, "Sales Manager", 110000, 003),
        (200, "Legal Admin", 125000, 002),
        (130, "Accountant", 75000, 001);
INSERT INTO employee (id, first_name, last_name,role_id,manager_id)
VALUES  (4574, "Bill","McBill", 300, NULL),
        (2578, "Bob", "Bobbington", 325, 4574),
        (2165, "Eric", "Ericson", 200, NULL),
        (2735, "Jim", "Jimmithy",250, 2165),
        (2531, "Carl", "Carlmore", 100, NULL),
        (6398, "Kevin", "Kevner", 130, 2531);