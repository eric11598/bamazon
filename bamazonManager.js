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

function queryAllData() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-");
    });
}

function runSearch() {
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
                    productSearch();
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

function productSearch() {
    console.log("lol")
}

function lowInventorySearch() {
    console.log("lol")
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
                var initial_quantity = answer.action.substr(answer.action.lastIndexOf('| ')+2, answer.action.length);
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
                            
                            else{
                                

          
                               
                                var final_quantity = parseInt(initial_quantity)+parseInt(answer.quantity);
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
                                    function(err, res) {
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



    /*
    inquirer
      .prompt({
        name: "item_id",
        type: "input",
        message: "What artist would you like to search for?"
      })
      .then(function(answer) {
        var query = "SELECT position, song, year FROM top5000 WHERE ?";
        connection.query(query, { artist: answer.artist }, function(err, res) {
          for (var i = 0; i < res.length; i++) {
            console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
          }
          runSearch();
        });
      });*/
}

function addProduct() {
    console.log("lol")
}