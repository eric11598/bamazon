var mysql = require("mysql");
var inquirer = require("inquirer");

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
    queryAllData();
});

function formatString(object, length, currency)
{
    if(currency){
        object = object.toFixed(2)
    }
    var string = JSON.stringify(object)
    string = string.padEnd(length)

    return string
}

function queryAllData() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("    ID     |     NAME       |     DEPARTMENT     |     PRICE     |  QUANTITY")
        console.log("-----------------------------------------------------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log("    "+formatString(res[i].item_id, 4) + "   |   " + formatString(res[i].product_name, 10) + "   |  " 
              + formatString(res[i].department_name, 15) + "   |   " + formatString(res[i].price, 8, true) + "    |   " 
              + formatString(res[i].stock_quantity, 5));
        }
        console.log("-");

        return runSearch()
    });

}


function runSearch() {
    connection.query("SELECT * FROM products", function (err, res) {
        var final_id;
        inquirer
            .prompt([

                {
                    name: "id",
                    type: "input",
                    message: "What is the ID of the item youd like?",
                    validate: function validateID(name) {
                        var message = '';
                        for (var i = 0; i < res.length; i++) {
                            if (name == res[i].item_id) {
                                final_id = name;
                                return true
                            }
                            else
                                message = "ID not found! -- enter a new one"
                        }

                        if (isNaN(name))
                            message = "Not a valid ID"

                        if (name === '')
                            message = "Please enter an ID"



                        if (message != '')
                            return message

                        else {
                            final_id = name;
                            return true
                        }
                    }
                },

                {
                    name: "quantity",
                    type: "input",
                    message: "How much of this product would you like to buy?",
                    validate: function validateID(name) {
                        var message = '';
                        if (isNaN(name))
                            message = "Not a valid quantity"

                        if (name === '')
                            message = "Please enter a quantity"
                        
                        for (var i = 0; i < res.length; i++) {
                            if (final_id == res[i].item_id) {
                                if (name > res[i].stock_quantity)
                                    message = "Insufficient quantity! Only " + res[i].stock_quantity + " left!"

                            }
                        }

                        if (message != '')
                            return message

                        else
                            return true
                    }
                }

            ])



            .then(function (answer) {

                var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
                connection.query(query, { item_id: answer.id }, function (err, res) {
                    for (var i = 0; i < res.length; i++) {
                        var final_quantity = res[i].stock_quantity - answer.quantity;
                        var final_price = answer.quantity * res[i].price;
                        var query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: final_quantity
                                },
                                {
                                    item_id: answer.id
                                }
                            ],
                            function (err, res) {
                                console.log("products quantities updated!");
                                console.log("amount due: $" + Number(final_price).toFixed(2));
                                console.log("\n\n");
                            }
                        
                    );
                };
                queryAllData()
            });
    });
});
}