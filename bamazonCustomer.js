var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('tty-table')('automattic-cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // username
    user: "root",

    // password
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
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push("" + results[i].item_id);
                        }
                        return choiceArray;
                    },
                    message: "What is the ID number of the product you would like to purchase?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to purchase?",
                    validate: function validateInput(value) {
                        if (isNaN(value) === false && value != "") {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === parseInt(answer.choice)) {
                        chosenItem = results[i];
                    }
                }


                if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {

                    connection.query(
                        "UPDATE products SET ? WHERE ?", [{
                                stock_quantity: (chosenItem.stock_quantity - answer.quantity)
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw error;
                            console.log("Your order was placed! \n Total price: $" + parseFloat(answer.quantity * chosenItem.price).toFixed(2));
                        }
                    );
                }
                else {
                    console.log("Insuffiecient quantity!");
                    start();
                }
            });
    });

}



displayItems();