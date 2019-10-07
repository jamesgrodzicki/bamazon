CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
    item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(25) NOT NULL,
    department_name VARCHAR(15),
    price DECIMAL(11,2) NOT NULL,
    stock_quantity INTEGER(11) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('phone charger','electronics',15.95,100), ('bible','religion',25,666), ('6-pack gatorade','food & drink',8.99,45), ('asus monitor','electronics',150,15), ('jeans','clothing',40,40), ('can of coke','food & drink',.95,1000), ('4 pack of sharpies','school',5,50), ('razer mouse','electronics',60,10), ('ruler','school',2.5,30), ('columbia jacket','clothing',195,5); 