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
        description VARCHAR ( 1000 ),
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
        ('Batman: The Animated Series Gotham City', 'Step into the shadows of Gotham with the Animated Batman Series Lego set. Recreate iconic scenes from the beloved series and join the Dark Knight in his quest to protect the city from its most notorious villains.', 299.99, '/images/batman-animated-series.jpg', 4),
        ('Millennium Falcon', 'Soar through the galaxy with the iconic Millennium Falcon set. This legendary starship is a must-have for any Star Wars fan, featuring intricate details that bring to life the fastest hunk of junk in the galaxy. Perfect for recreating daring adventures or designing your own interstellar missions.', 499.99, '/images/millennium-falcon.jpg', 3),
        ('Dune Atreides Royal Ornithopter', 'The Dune Atreides Royal Ornithopter lets fans recreate the iconic aircraft from the epic sci-fi movie Dune. With its detailed design, flapping wings, and authentic color scheme, this build captures the futuristic yet rugged look of the ornithopter, perfect for both display and imaginative play.', 164.99, '/images/dune-ornithopter.jpg', 2),
        ('Daily Bugle', 'The Lego Daily Bugle tower set brings the iconic Spider-Man universe to life with a towering, detailed replica of the famous newspaper building. Standing over 32 inches tall, this intricate set includes multiple floors, vivid interiors, and a wide array of minifigures, including Spider-Man, J. Jonah Jameson, and other Marvel characters, making it a must-have for superhero fans and collectors alike.', 349.99, '/images/daily-bugle.jpg', 4),
        ('A-Frame Cabin', 'This A-Frame Cabin set offers a cozy and detailed retreat into nature, capturing the charm of a rustic cabin with its unique triangular design. Featuring a detailed interior, surrounded by trees and wildlife, this set provides a relaxing building experience for nature lovers and is perfect for display in any collection.', 179.99, '/images/a-frame-cabin.jpg', 1);
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
