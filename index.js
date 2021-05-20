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
            "Exit"
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
          case "Exit":
            connection.end();
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

addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "dept",
      message: "New department name:"
    })

    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.dept,
        },
        
        function (err, res) {
          if (err) throw err;
          console.table(res);

          questions();
        }
      )
    })
};

addRole = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    const arr = res.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Role title:",
        },
        {
          type: "input",
          name: "salary",
          message: "Salary:",
        },
        {
          type: "list",
          name: "dept",
          message: "Department:",
          choices: arr,
        },
      ])

      .then((answer) => {
        console.log(answer);
        connection.query(
          "INSERT INTO roles SET ?",
          [
            {
              title: answer.title,
              salary: answer.salary,
              department_id: answer.dept,
            },
          ],

          function (err, res) {
            if (err) throw err;
            console.table(res);

            questions();
          }
        )
      })
  })
};

addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first",
        message: "Employee First Name:",
      },
      {
        type: "input",
        name: "last",
        message: "Last Name:",
      },
    ])

    .then((answer) => {
      let firstName = answer.first;
      let lastName = answer.last;

      connection.query(`SELECT * FROM roles`, function (err, res) {
        if (err) throw err;
        const roleChoices = res.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "Role:",
              choices: roleChoices,
            },
          ])

          .then((answer) => {
            let roleId = answer.roles;

            connection.query(`SELECT * FROM employee`, function (err, res) {
              if (err) throw err;
              const managerChoices = res.map(
                ({ id, first_name, last_name, man_ind }) => ({
                  name: first_name + " " + last_name,
                  value: id,
                  man_ind,
                })
              );

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Manager:",
                    choices: managerChoices,
                  },
                ])

                .then((answer) => {
                    connection.query(
                      "INSERT INTO employee SET ?",
                      {
                        first_name: firstName,
                        last_name: lastName,
                        roles_id: roleId,
                        manager_id: answer.manager,
                      },

                      function (err, res) {
                        if (err) throw err;
                        console.table(res);

                        questions();
                      }
                    )
                })
            })
          })
      })
    })
};

updateRole = () => {
  connection.query(`SELECT * FROM employee`, function (err, res) {
    if (err) throw err;
    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeUpdate",
          message: "Which employee do you want to update?",
          choices: employeeChoices,
        },
      ])

      .then((answer) => {
        let employee_id = answer.employeeUpdate;
        connection.query(`SELECT * FROM roles`, function (err, res) {
          if (err) throw err;
          const roleChoices = res.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "New role:",
                choices: roleChoices,
              },
            ])

            .then((answer) => {
              console.log("employee: ", employee_id, " role:", answer.roles);
              connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                  {
                    roles_id: answer.roles,
                  },
                  {
                    id: employee_id,
                  },
                ],

                function (err, res) {
                  if (err) throw err;
                  console.table(res);

                  questions();
                }
              )
            })
        })
      })
  })
};