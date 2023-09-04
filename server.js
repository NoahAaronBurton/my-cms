//! remove nodemon from dependencies before deploy
const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');

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
  db.query(`SELECT * FROM department`, function(err, results) { // chat GPT helped me with this formatting
    console.log('\n');
    console.log('id  Dept. Name ');
    console.log('--  ----------');
    results.forEach((row) => {
      console.log(` ${row.id}   ${row.name} `);
     
    })
    console.log('\n');
    mainMenu();
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


//* current 'back' function: call mainMenu() in the cond. statement
function mainMenu(){
inquirer
  .prompt(questions)
  .then(function (data) {
    
    if (data.mainMenu === 'View All Departments') {
      showDepartments();
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