DROP DATABASE IF EXISTS db;
CREATE DATABASE db;

USE db;

CREATE TABLE department (
    id VARCHAR(8) NOT NULL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
    
);

-- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
CREATE TABLE role (
    id INT PRIMARY KEY NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id VARCHAR(8) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
    
);

-- employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to --
CREATE TABLE employee (
    id VARCHAR(8) PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id VARCHAR(8) NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id) 
);