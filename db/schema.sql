DROP DATABASE IF EXISTS db;
CREATE DATABASE db;

USE db;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
    
);

-- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
CREATE TABLE role (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);