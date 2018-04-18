DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE table products (
	item_id INTEGER(20) AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(5,2),
    stock_quantity INT(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products (
  product_name
, department_name
, price
, stock_quantity
) VALUE 
(
"Kitty Litter"
, "Cat Isle"
, 16.89
, 15
),
("Dog Treats"
, "Treat Isle"
, 8.50
, 30);

SELECT * FROM products;

