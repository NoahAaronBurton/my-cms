//! remove nodemon from dependencies before deploy
const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
var AsciiTable = require('ascii-table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const db = mysql.createConnection({
  host: '127.0.0.1', // !Change this to your database host
  user: 'root', // Change this to your database username
  password: '', // Change this to your database password
  database: 'db' //! Change this to your database name
},
    console.log(`connected to db`)
);


function showDepartments() {
  db.query(`SELECT * FROM department`, function(err, results) { 
    console.log('\n');
    console.log('id  Dept. Name ');
    console.log('--  ----------');
    results.forEach((row) => { //* row is semantic and arbitrary
      console.log(` ${row.id}   ${row.name} `);
     
    })
    console.log('\n');
    mainMenu();
  })
}

function showRoles() {
  db.query(
    `SELECT role.title, role.id, department.name, role.salary FROM role INNER JOIN department ON role.department_id = department.id;`,
    function (err, results) {
      if (err) {
        console.error(err);
        return;
      }

      // class from node module for tables
      let table = new AsciiTable('All Roles');
      table.setHeading('Title', 'Id', 'Department', 'Salary');

      // chat gpt assisted with this results block
      results.forEach((row) => {
        table.addRow(row.title, row.id, row.name, row.salary);
      });

      console.log(table.toString());

      // go back
      mainMenu();
    }
  );
}

function showEmployees() {
  db.query(`SELECT employee.id AS employee_id, department.name AS department_name, employee.first_name, employee.last_name, role.title, role.id, role.department_id, role.salary, employee.manager_id FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;`,
  function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    let table = new AsciiTable('All Employees');
    table.setHeading('Employee Id', 'First Name', 'Last Name', 'Role', 'Department', 'Role Id', 'Manager Id');
   // todo: department
    results.forEach((row) => {
      table.addRow(row.employee_id, row.first_name, row.last_name, row.title, row.department_name, row.id, row.manager_id);
    });
    console.log(table.toString());
  })
}

const questions = [
  {
    name: 'mainMenu',
    type: 'list', 
    message: 'Select an action:',
    choices: [ 
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee Role',
    ]
  },
  
]



function mainMenu(){
inquirer
  .prompt(questions)
  .then(function (data) {
    
    if (data.mainMenu === 'View All Departments') {
      showDepartments();
     } if (data.mainMenu === 'View All Roles') {
      showRoles();
     } if (data.mainMenu === 'View All Employees') {
      showEmployees();
     }
  })
}
mainMenu();
// ---LEAVE AT BOTTOM---
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});