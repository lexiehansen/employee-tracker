const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    database: 'employees_db',
});


connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    questions();
  });
  
  function questions() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "menu",
          message: "What would you like to to do?",
          choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit",
          ],
        },
      ])
      .then((answer) => {
        console.log(answer.menu);
        switch (answer.menu) {
          case "View all departments":
            viewAll("department");
            break;
          case "View all roles":
            viewAll("roles");
            break;
          case "View all employees":
            viewAll("employee");
            break;
          case "Add a department":
            addDepartment();
            break;
          case "Add a role":
            addRole();
            break;
          case "Add an employee":
            addEmployee();
            break;
          case "Update an employee role":
            updateRole();
            break;
          case "Quit":
            connection.end;
        }
      });
  }
  
  viewAll = (tableName) => {
    connection.query(
      `SELECT * FROM ??`,
      [tableName],
  
      function (err, res) {
        if (err) throw err;
        console.table(res);
  
        questions();
      }
    );
  };
