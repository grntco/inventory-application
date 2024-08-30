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
        image VARCHAR ( 100 ),
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    INSERT INTO items (name, description, price, image, category_id)
    VALUES 
        ('Yellow Delivery Truck', 'Wow, a delivery truck!', 99.99, '/images/delivery-truck.jpg', 1),
        ('Death Star', 'Build the Death Star, a classic set!', 999.99, '/images/death-star.jpg', 3),
        ('Saturn V', 'Launch astronauts to the moon!', 399.99, '/images/saturn-v.jpg', 2),
        ('Batman Animated Series', 'Fight crime in Gotham!', 149.99, '/images/batman-animated-series.jpg', 4);
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
