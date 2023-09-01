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
  database: 'test_db' //! Change this to your database name
},
    console.log(`connected to test db`)
);

//! rename table and params
db.query(`DELETE FROM test_table WHERE id = ?`, 2, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });

db.query('SELECT * FROM test_table', function (err, results) {
    console.log(results);
  });  

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
