var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('tty-table')('automattic-cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "alexs1130",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

function displayItems() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log(results[i].item_id + " | " +
                results[i].product_name + " | Department: " +
                results[i].department_name + " | Price: " +
                results[i].price + " | In stock: " +
                results[i].stock_quantity);
        }
    });
    start();
}

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What is the ID number of the product you would like to purchase?"
                }
                ,
                {
                    name: "purchaseAmount",
                    type: "input",
                    message: "How many would you like to purchase?"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                    if (results.item_id === answer.choice) {
                        chosenItem = answer.choice;
                        console.log(chosenItem);
                    
                }

                var amount;
                    if (results.item_id === answer.purchaseAmount) {
                        amount= answer.purchaseAmount;
                    }
                //if answer <= results.stock_quantity, subtract answer from stock_quantity
                // else "Insufficient quantity!", start();
                if (answer.purchaseAmount <= chosenItem.stock_quantity) {
                    var query = connection.query(
                        "UPDATE products SET ? WHERE ?", [
                            {
                                stock_quantity: answer.amount
                            },
                            {
                                item_id: chosenItem.id
                            }
                        ],
                        function (error, results) {
                            if (error) throw err;
                            console.log(results.affectedRows + " updated!\n");
                            // console.log("Bid placed successfully!");
                        }
                    );
                } else {
                    console.log("Insufficient funds!");
                }

            });
    });

}

function buyProduct() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt({
                name: "purchaseAmount",
                type: "input",
                message: "How many would you like to purchase?",
                // validate: function (input) {
                //     // Declare function as asynchronous, and save the done callback
                //     var done = this.async();

                //     // Do async stuff
                //     setTimeout(function() {
                //       if (typeof input !== 'number') {
                //         // Pass the return value in the done callback
                //         done('You need to provide a number');
                //         return;
                //       }
                //       // Pass the return value in the done callback
                //       done(null, true);
                //     }, 3000);
                //   }
            })
            .then(function (answer) {
                var amount;
                //if answer <= results.stock_quantity, subtract answer from stock_quantity
                // else "Insufficient quantity!", start();
                // if (answer <= results.stock_quantity) {
                //     amount = results.stock_quantity - answer.purchaseAmount;
                //     console.log(amount);
                // }
             console.log(answer);   
            });
    });
}



displayItems();