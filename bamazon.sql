-- DROP DATABASE IF EXISTS bamazon; --
-- Creates the "favorite_db" database --
CREATE DATABASE bamazon;
use bamazon;
CREATE TABLE products (
  item_id integer not null auto_increment,
  primary key(item_id),
  product_name varchar(50) not null,
  department_name varchar(50),
  price integer(10),
  stock_quantity integer(10)
);
