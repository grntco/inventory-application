require("dotenv").config();
const { Client } = require("pg");

const SQL = `
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR ( 100 )
    );

    INSERT INTO categories (name) 
    VALUES 
        ('City'),
        ('Space'),
        ('Star Wars'),
        ('Superheroes');

    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR ( 100 ),
        description VARCHAR ( 255 ),
        price NUMERIC ( 10, 2 ),
        quantity INTEGER,
        image VARCHAR ( 100 ),
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    INSERT INTO items (name, description, price, quantity, category_id)
    VALUES 
        ('Yellow Delivery Truck', 'Wow, a delivery truck!', 99.99, 10, 1),
        ('Death Star', 'Build the Death Star, a classic set!', 999.99, 20, 3),
        ('Saturn V', 'Launch astronauts to the moon!', 399.99, 5, 2),
        ('Batcave', 'Fight crime in Gotham from the Batcave!', 149.99, 2, 4);
`;

async function main() {
  console.log("seeding...");

  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
