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
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    INSERT INTO items (name, description, category_id)
    VALUES 
        ('Schoolbus', 'Create a schoolbus!', 1),
        ('Death Star', 'Build the Death Star, a classic set!', 3),
        ('Saturn V', 'Launch astronauts to the moon!', 2),
        ('Batcave', 'Fight crime in Gotham from the Batcave!', 4);
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
