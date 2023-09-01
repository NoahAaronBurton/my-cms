const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

//! Create a connection to your MySQL database
const db = mysql.createConnection({
  host: '127.0.0.1', // !Change this to your database host
  user: 'root', // Change this to your database username
  password: '', // Change this to your database password
  database: 'test_db' //! Change this to your database name
},
    console.log(`connected to test db`)
);


