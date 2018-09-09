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
    runSearch();
});



function runSearch() {
    console.log("\n")
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do manager?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    queryAllData();
                    break;

                case "View Low Inventory":
                    lowInventorySearch();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        });
}

function queryAllData() {
    console.log("\n")
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + ".00 | " + res[i].stock_quantity);
        }
        console.log("-");
    });

    console.log("\n")
    return runSearch();
}

function lowInventorySearch() {

    
    connection.query("SELECT * FROM products WHERE stock_quantity<=5", function (err, res) {

        if (res.length === 0) {
            console.log("No items quantity lower than 5!")
        }

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-");

        console.log("\n")
        return runSearch();
    });


}



function addToInventory() {

    var choiceArray = [];

    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err, res) {



        for (var i = 0; i < res.length; i++) {
            var choice = res[i].item_id + " | " + res[i].product_name + " | " + res[i].stock_quantity;
            choiceArray.push(choice)
        }
        console.log("-----");


        inquirer
            .prompt({
                name: "action",
                type: "list",
                message: "What would you like to add to?",
                choices: choiceArray
            })
            .then(function (answer) {

                var id = answer.action.substr(0, answer.action.indexOf(' |'));
                var initial_quantity = answer.action.substr(answer.action.lastIndexOf('| ') + 2, answer.action.length);
                inquirer
                    .prompt([
                        {
                            name: "quantity",
                            type: "input",
                            message: "And how much stock would you like to add to item id " + id
                        },
                    ])
                    .then(function (answer) {

                        if (isNaN(answer.quantity)) {
                            console.log("PLEASE ENTER A VALID QUANTITY")
                            addToInventory()
                        }

                        else {

                            var final_quantity = parseInt(initial_quantity) + parseInt(answer.quantity);
                            console.log(final_quantity);

                            var query = connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: final_quantity
                                    },
                                    {
                                        item_id: id
                                    }
                                ],
                                function (err, res) {
                                    console.log("products quantities updated!");
                                    console.log("\n\n");
                                }
                            );
                            console.log(query.sql);
                            queryAllData();
                        }

                    });

            });


    });

}

function addProduct() {


    connection.query("SELECT * FROM products", function (err, res) {
        
        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "What is the ID of the item youd like to add?",
                    validate: function validateID(name) {
                        var message = '';
                        if (isNaN(name))
                            message = "Not a valid ID"

                        for (var i = 0; i < res.length; i++) {

                            if (name == res[i].item_id) {
                                message = "ID already exists -- choose another"
                            }
                        }

                        if (message != '')
                            return message

                        else
                            return true
                    }


                },
                {
                    name: "product",
                    type: "input",
                    message: "What is the name of the product youd like to add?",
                    validate: function validateID(name) {
                        var message = '';
                        for (var i = 0; i < res.length; i++) {

                            if (name == res[i].product_name) {
                                message = "Product already exists -- choose another"
                            }
                        }

                        if (message != '')
                            return message

                        else
                            return true
                    }
                },
                {
                    name: "department",
                    type: "input",
                    message: "What is the name of the department associated with the product?",
                    validate: function validateID(name) {
                        var message = '';
                        
                        if(name === '')
                            message = "Please enter a department"

                        if (message != '')
                            return message

                        else
                            return true
                    }
                },
                {
                    name: "price",
                    type: "input",
                    message: "What is the price of the item?",
                    validate: function validateID(name) {
                        var message = '';
                        if (isNaN(name))
                            message = "Not a valid price value"

                        if (message != '')
                            return message

                        else
                            return true
                    }
                },
                {
                    name: "amount",
                    type: "input",
                    message: "How much of the product would you like to add?",
                    validate: function validateID(name) {
                        var message = '';
                        if (isNaN(name))
                            message = "Not a valid quantity"

                        if (message != '')
                            return message

                        else
                            return true
                    }
                },
            ])
            .then(function (answer) {

                var query = connection.query(
                    "INSERT INTO products SET ?",
                    {

                      item_id: answer.id,
                      product_name: answer.product,
                      department_name: answer.department,
                      price: answer.price,
                      stock_quantity: answer.amount,
                    },
                    function(err, res) {
                      console.log(" product inserted!\n");
                      console.log(query.sql);
                      console.log("\n")
                      queryAllData();
                    }
                  );
            });
    });
}



