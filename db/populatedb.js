require("dotenv").config();
const { Client } = require("pg");

const SQL = `
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR ( 100 ),
        description VARCHAR ( 1000 )
    );

    INSERT INTO categories (name, description) 
    VALUES 
        ('City', 'Build bustling urban landscapes with our City-themed Lego sets. Whether it''s constructing skyscrapers, managing traffic, or running a delivery service, these sets capture the vibrant life of a modern metropolis.'),
        ('Space', 'Explore the wonders of the cosmos with our Space-themed Lego sets. From lunar landings to deep space missions, these sets let you build and imagine adventures beyond Earth, perfect for aspiring astronauts and space enthusiasts.'),
        ('Star Wars', 'Journey to a galaxy far, far away with our Star Wars Lego collection. Whether you''re recreating epic battles or crafting iconic starships, these sets bring the excitement of the Star Wars universe to life for fans of all ages.'),
        ('Superheroes', 'Immerse yourself in the thrilling universe of heroes and villains with our Superheroes Lego sets. Build epic battles, iconic locations, and unleash your creativity as you bring legendary characters to life in your own unique adventures.');

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
        ('Yellow Delivery Truck', 'Ensure your city''s shelves are always stocked with the Yellow Lego Delivery Truck. This set includes miniature Lego boxes and sets, making it the perfect addition to your bustling urban landscape, where every delivery keeps the city thriving.', 99.99, '/images/delivery-truck.jpg', 1),
        ('The Death Star', 'Command the might of the Empire with the Death Star Lego set. This colossal battle station is packed with intricate details, perfect for recreating pivotal moments from the Star Wars saga or designing your own galactic showdowns.', 799.99, '/images/death-star.jpg', 3),
        ('Saturn V', 'Blast off on an epic journey with the Saturn V Rocket Lego set. This detailed replica pays homage to the historic moon missions and is a must-have for space enthusiasts and model builders alike.', 399.99, '/images/saturn-v.jpg', 2),
        ('Batman: The Animated Series Gotham City', 'Step into the shadows of Gotham with the Animated Batman Series Lego set. Recreate iconic scenes from the beloved series and join the Dark Knight in his quest to protect the city from its most notorious villains.', 299.99, '/images/batman-animated-series.jpg', 4);
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
