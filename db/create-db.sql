CREATE DATABASE car_shop;
\c car_shop
CREATE TABLE cars(ID SERIAL PRIMARY KEY, MAKE TEXT NOT NULL, MODEL TEXT NOT NULL, COLOR TEXT NOT NULL, VOLUME INT NOT NULL, MILEAGE INT NOT NULL, YEAR INT NOT NULL);
INSERT INTO cars VALUES (default, 'BMW', 'X5', 'Green', 4500, 50000, 2015);
INSERT INTO cars VALUES (default, 'Mercedes', 'CLA', 'Silver', 1500, 25000, 2019);
INSERT INTO cars VALUES (default, 'Toyota', 'Camry', 'Black', 3500, 35000, 2022);
