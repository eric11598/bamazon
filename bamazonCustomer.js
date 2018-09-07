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

function queryAllData() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-");
    });

    runSearch()
}
    

function runSearch() {
    inquirer
        .prompt([

            {
                name: "id",
                type: "input",
                message: "What is the ID of the item youd like?"
            },

            {
                name: "quantity",
                type: "input",
                message: "And how much?"
            }

        ])
        .then(function (answer) {

            var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
            connection.query(query, { item_id: answer.id }, function (err, res) {
                if (res.length === 0) {
                    console.log("invalid id -- enter a valid id!")
                    runSearch();
                }

                if(isNaN(answer.quantity))
                {
                    console.log("invalid quantity -- enter a valid quantity!")
                    runSearch();
                }  
                else {
                    for (var i = 0; i < res.length; i++) {
                        console.log("Name: " + res[i].product_name);
                        if(answer.quantity > res[i].stock_quantity)
                        {
                            console.log("Not enough stock! Only "+res[i].stock_quantity+" in stock!")
                            runSearch();
                        }

                        else
                        {
                            var final_quantity = res[i].stock_quantity - answer.quantity;
                            var final_price = answer.quantity*res[i].price;
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
                                function(err, res) {
                                  console.log("products quantities updated!");
                                  console.log("amount due: $"+Number(final_price).toFixed(2));
                                  console.log("\n\n");
                                }
                              );
                        }
                        console.log(query.sql);
                        queryAllData()
                    }
                }
            });
        });
}

  /*CREATE TABLE products (
	item_id INT NOT NULL,
	product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);
*/