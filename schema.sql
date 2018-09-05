DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL,
	product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (001, "keyboard", "electronics", 25.00, 20);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (002, "monitor", "electronics", 100.00, 20);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (003, "mouse", "electronics", 10.00, 20);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (004, "shirt", "clothing", 50.00, 20);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (005, "pants", "clothing", 75.00, 20);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (006, "hat", "clothing", 15.00, 20);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (007, "couch", "furniture", 115.00, 20);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (008, "chair", "furniture", 25.00, 20);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (009, "bed", "furniture", 300.00, 20);

-- INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
-- VALUES (010, "desk", "furniture", 150.00, 20);


