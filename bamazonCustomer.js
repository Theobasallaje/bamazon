var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) { throw err; }

    console.log("connected")
    start()
});

function start() {
    connection.query('SELECT * FROM products', function (err, result) {
        console.table(result);
        inquirer
            .prompt([
                {
                    name: "id",
                    message: "Which product would you like to order? Enter in the item id",
                    type: "input"
                },
                {
                    name: "quantity",
                    message: "How many would you like to order?",
                    type: "input"
                }
            ]).then(answer => {
                var stock = result[(answer.id) - 1].stock_quantity;
                // console.log(stock);
                // console.log(result[(answer.id)-1].stock_quantity);
                var orderAmount = answer.quantity;
                // console.log(orderAmount);
                var newStock = stock - orderAmount;
                // console.log(newStock);
                // console.log(answer);
                handleOrder(answer, stock, orderAmount, newStock);
            })
    })
}


function handleOrder(answer, stock, orderAmount, newStock) {
    if (stock > orderAmount) {
        //update quatity with mysql 
        // console.log(newStock);
        // console.log(answer.id);
        connection.query(`UPDATE products SET stock_quantity = ${newStock} WHERE item_id = ${answer.id}`, function (err, result) {
            if (err) {
                console.log("There was a problem with your order!");
                throw err;
            } else {
                //log order successful
                console.log("Order Successful!");
                console.log("Updated Information for the item you ordered:");
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
        })
    } else {
        console.log("Insufficient quantity!");
        connection.end();
    }
}