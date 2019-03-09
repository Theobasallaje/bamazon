var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    showOptions();
});

function showOptions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function getStock(id) {
    connection.query('SELECT * FROM products', function (err, result) {
        var stock = result[id-1].stock_quantity;
        return stock;
    })
}

function viewProducts() {
    connection.query('SELECT * FROM products', function (err, result) {
        console.table(result);
        showOptions();
    })
    //   inquirer
    //     .prompt({
    //       name: "products",
    //       type: "input",
    //       message: "What artist would you like to search for?"
    //     })
    //     .then(function(answer) {
    //       var query = "SELECT position, song, year FROM top5000 WHERE ?";
    //       connection.query(query, { artist: answer.artist }, function(err, res) {
    //         for (var i = 0; i < res.length; i++) {
    //           console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
    //         }
    //         showOptions();
    //       });
    //     });
}

function viewLowInventory() {
    // var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.table(res[i]);
            }
        }
        showOptions();
    });
}

function addInventory(stock) {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "Enter Product ID to add: ",
            },
            {
                name: "quantity",
                type: "input",
                message: "How Many would you like to add? ",
            }
        ])
        .then(function (answer) {
            var newStock = answer.quantity + (getStock(answer.id)); 
            console.log(answer.id);
            console.log(newStock);
            console.log(stock);
            var query = `UPDATE products SET stock_quantity = ${newStock} WHERE item_id = ${answer.id}`;
            connection.query(query, function (err, result) {
                if (err) {
                    console.log("There was a problem!");
                    showOptions();
                    throw err;
                } else {
                    //log order successful
                    console.log("Success!");
                    console.log("Updated Information for the item you added:");
                    connection.query('SELECT * FROM products WHERE item_id =' + answer.id, function (err, result) {
                        if (err) {
                            throw err;
                        }
    
                        console.table(result);
                        connection.end();
                    })
                    // console.table(result);
                    // console.log(result);
                }
                showOptions();
            });
        });
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "What is the Item you like to add? ",
            },
            {
                name: "department",
                type: "input",
                message: "What is the department? ",
            },
            {
                name: "price",
                type: "input",
                message: "How much does it cost (Just enter in numbers)? ",
            },
            {
                name: "quantity",
                type: "input",
                message: "How much do you have? ",
            }
        ])
        .then(function (answer) {
            var query = `insert into products (product_name, department_name, price, stock_quantity) values ("${answer.product}", "${answer.department}", "${answer.price}", "${answer.quantity})",`;
            connection.query(query, function (err, result) {
                if (err) {
                    console.log("There was a problem entering in your item!");
                    showOptions();
                    throw err;
                } else {
                    //log order successful
                    console.log("Success!");
                    console.log("Updated Inventory including the item you added:");
                    connection.query('SELECT * FROM products', function (err, result) {
                        if (err) {
                            throw err;
                        }
    
                        console.table(result);
                        connection.end();
                    })
                    // console.table(result);
                    // console.log(result);
                }
                showOptions();
            });
        });
}
