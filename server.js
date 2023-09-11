//! remove nodemon from dependencies before deploy
const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
var AsciiTable = require('ascii-table');
const { v4: uuidv4 } = require('uuid');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const db = mysql.createConnection({
  host: '127.0.0.1', //! cant be localhost for some reason
  user: 'root', 
  password: 'McFlurrywoo22', 
  database: 'db' 
},
    console.log(`connected to db`)
);


function showDepartments() {
  db.query(`SELECT * FROM department`, function(err, results) { 
    let table = new AsciiTable('All Departments');
    table.setHeading('Id', 'Department Name')
    results.forEach((row) => { //* row is semantic and arbitrary
     table.addRow(row.id, row.name)
    })
    console.log(table.toString());
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
    results.forEach((row) => {
      table.addRow(row.employee_id, row.first_name, row.last_name, row.title, row.department_name, row.id, row.manager_id);
    });
    console.log(table.toString());
    mainMenu();
  })
}

function addDepartment(addDepartment) {
 
  let randomID = uuidv4();
  let id = randomID.substring(1,8) //TRIM ID  
  db.query(`insert into department values ('${id}','${addDepartment}');`,
  function(err, results) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`\n New Department added!: ${addDepartment} \n The new ID for this department is:\n${id} \n` )
    getDepartments();
    mainMenu();
  })
}

function addEmployee(id,firstName,lastName,isManager, addManager,roleId) {
  let randomID = uuidv4();
  id = randomID.substring(1, 8);

  let newEmployeeManager;
  // id if not manager, null if they are a manager
  if (isManager === true) {
    newEmployeeManager = null;
  } else {
  newEmployeeManager  = JSON.stringify(addManager);
  }

  db.query(`INSERT INTO employee VALUES ('${id}','${firstName}','${lastName}','${roleId}', ${newEmployeeManager})`);
  console.log(`\n New Employee added!: ${firstName} ${lastName} \n The new Employee ID for ${firstName} is:\n${id} \n` )
  mainMenu();
}

let employeeChoices = [];
function getEmployees () {
  db.query(`SELECT id, first_name, last_name FROM employee`, function (err,results) {
    if (err) {
      console.error('Error retrieving employees:', err);
      return;
    } 

    for (let i = 0; i < results.length; i++) {
      const row= results[i];
      const employeeChoice = {
        name: `${row.first_name} ${row.last_name}`,
        value: row.id,
      };
      employeeChoices.push(employeeChoice);
    }
  })
}

let roleChoices = [];
function getRollChoices() {
  db.query(`SELECT id, title FROM role`, function(err,results) {
    if (err) {
      console.error('Error retrieving employees:', err);
      return;
    };
    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      const roleChoice = {
        name: `${row.title}`,
        value: row.id,
      
    }
      roleChoices.push(roleChoice);
  }
  })
}

function updateRole(employeeId, newRoleId) {
  db.query(
    'UPDATE employee SET role_id = ? WHERE id = ?',
    [newRoleId, employeeId],
    function (err, results) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Employee role updated successfully.`);
      mainMenu();
    }
  );
}

let managerChoices = []; 
function getManagers() { 

  db.query( // select all null manager id rows
    'SELECT e.id, e.first_name, e.last_name FROM employee e WHERE e.manager_id IS NULL;', // chat gpt helped with this query
    (err, results) => {
      if (err) {
        console.error('Error retrieving managers:', err);
        return;
      } 

      for (let i = 0; i < results.length; i++) {
        const row= results[i];
        const managerChoice = {
          name: `${row.first_name} ${row.last_name}`,
          value: row.id,
        };
        managerChoices.push(managerChoice);
      }
  })
}


let departmentChoices = [];
function getDepartments() {
  db.query(`SELECT * FROM department`, function(err, results) { 
    for (let i = 0; i < results.length; i++) {
      const row= results[i];
      const departmentChoice = {
        name: `${row.name}`,
        value: row.id,
      };
      departmentChoices.push(departmentChoice);
    }
  })
}


function addRole (id,roleName,salary,departmentName) {
  db.query(`INSERT INTO role VALUES (${id},'${roleName}',${salary},'${departmentName}')`)
  console.log(`\n New Role added!: ${roleName} \n The new Role ID for ${roleName} is:\n${id} \n` )

  mainMenu();
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
  {
    name: 'addDepartment',
    type: 'input',
    when: (answers) => answers.mainMenu === 'Add Department',
    message: 'Give your new department a name:',
    validate(input) {
      if(input.length >= 30 || input.length === 0) {
        console.log(input);
        return 'Maximum length cannot exceed 30 characters and must be at least one character'
      } else {
        return true;
      }
    }
  },
  { // new employee
    name:'addFirstName',
    type: 'input',
    when: (answers) => answers.mainMenu === 'Add Employee',
    message: 'Enter the First Name of your new employee:',
    validate(input) {
      if(input.length >= 30 || input.length === 0) {
        
        return 'Maximum length cannot exceed 30 characters and must be at least one character'
      } else {
        return true;
      }
    } 
  },
  {
    name: 'addLastName',
    type: 'input',
    when: (answers) => answers.mainMenu === 'Add Employee',
    message: 'Enter the Last Name for new employee:',
    validate(input) {
      if(input.length >= 30 || input.length === 0) {
        console.log(input);
        return 'Maximum length cannot exceed 30 characters and must be at least one character'
      } else {
        return true;
      }
    } 
  },
  {
    name: 'isManager',
    type: 'confirm',
    message: 'Is the new employee in a management role?',
    when: (answers) => answers.mainMenu === 'Add Employee',
  },
  {
    name: 'addManager',
    type: 'list',
    when: (answers) => answers.isManager === false,
    message: 'Enter the supervising Manager of new employee:',
    choices: managerChoices,
  },
  {
    name: 'addRole', 
    type: 'input',
    when: (answers) => answers.mainMenu === 'Add Employee',
    message: 'Enter the Role Id that corresponds to the new employees role:',
    validate(input) {
      if(input.length >= 8 || input.length === 0) {
        console.log(input);
        return 'Maximum length cannot exceed 8 characters and must be at least one character'
      } else {
        return true;
      }
    } 
  },
  { // new role
    name: 'roleId',
    type: 'input',
    when: (answers) => answers.mainMenu === 'Add Role',
    message: 'Give your new Role an ID (a number between 0-999)',
    validate(input) {
      if(input.length >= 4 || input.length === 0) {
        console.log(input);
        return 'Maximum length cannot exceed 3 characters and must be at least one character'
      } else {
        return true;
      }
    }  
  },
  { 
    name: 'roleName',
    type: 'input',
    when: (answers) => answers.mainMenu === 'Add Role',
    message: 'Enter a name for the new Role:',
    validate(input) {
      if(input.length >= 30 || input.length === 0) {
        console.log(input);
        return 'Maximum length cannot exceed 8 characters and must be at least one character'
      } else {
        return true;
      }
    }  
  },
  {
    name: 'addSalary',
    type: 'input',
    when: (answers) => answers.mainMenu === 'Add Role',
    message: 'Enter the yearly Salary for this Role:',
    validate(input) {
      if (!/^\d+$/.test(input)) {
        return 'Input must contain only numbers';
      } else {
        return true;
      }
    }
  },
  {
    name: 'selectDepartment',
    type: 'list',
    when: (answers) => answers.mainMenu === 'Add Role',
    message: 'Select the department this role belongs to:',
    choices: departmentChoices
  },
  { // update employee
    name: 'employeeUpdateId',
    type: 'list',
    when: (answers) => answers.mainMenu === 'Update Employee Role',
    message: 'Select the employee you want to update the role for:',
    choices: employeeChoices
  }, 
  {
    name: 'newRole',
    type: 'input',
    when: (answers) => answers.mainMenu === 'Update Employee Role', 
    message: 'Enter the corresponding Role ID for the new Role:',
    
  }, 
  

]



function mainMenu(){
inquirer
  .prompt(questions)
  .then(function (data) {
    console.log(data);
    
    if (data.mainMenu === 'View All Departments') {
      showDepartments();
     } if (data.mainMenu === 'View All Roles') {
      showRoles();
     } if (data.mainMenu === 'View All Employees') {
      showEmployees();
     } if (data.mainMenu === "Add Department") {
      addDepartment(data.addDepartment);
     } if (data.mainMenu === 'Add Employee') {
      addEmployee(data.id,data.addFirstName,data.addLastName,data.isManager,data.addManager,data.addRole);
     } if (data.mainMenu === 'Add Role') {
      addRole(data.roleId,data.roleName,data.addSalary,data.selectDepartment)
     } if (data.mainMenu === 'Update Employee Role') {
      updateRole(data.employeeUpdateId, data.newRole)
     }
  })
}

// ---LEAVE AT BOTTOM---
// todo: refresh all choices function that doesnt double them up.
getRollChoices();
getEmployees();
getManagers();
getDepartments();
mainMenu();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});