INSERT INTO department (department_name) 
VALUES 
("Sales"), 
("HR"), 
("Finance"), 
("Engineering"), 
("Operations");

INSERT INTO roles (title, salary, department_id)
VALUES 
("Sales Agent", 40000 , 1),  
("HR Coordinator", 60000, 2),
("Accountant", 100000, 3),
("Lead Engineer", 150000 , 4),
("Lead Developer", 120000, 5),
("Manager", 100000, 5);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES 
("John", "Seller", 1, 5),
("Jane", "Resource", 2, 5),
("Jessica", "Money", 3, 5),
("Jack", "Smart", 4, 5),
("Jerry", "Dev", 5, 5),
("Janine", "Boss", 5, 2);