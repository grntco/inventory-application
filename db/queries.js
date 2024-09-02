const pool = require("./pool");

async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM items");
  return rows;
}

async function getItemsByCategory(category_id) {
  const { rows } = await pool.query(
    "SELECT * FROM items WHERE category_id = $1",
    [category_id]
  );
  return rows;
}

async function getFeaturedItem(category_id) {
  let result;
  if (category_id) {
    result = await pool.query("SELECT * FROM items WHERE category_id = $1", [
      category_id,
    ]);
  } else {
    result = await pool.query("SELECT * FROM items");
  }

  return result.rows[0];
}

async function insertItem(data) {
  const { name, description, price, image, category_id } = data;
  const values = [name, description, price, image, category_id];
  await pool.query(
    "INSERT INTO items (name, description, price, image, category_id) VALUES($1, $2, $3, $4, $5)",
    values
  );
}

async function updateItem(id, data) {
  const { name, description, price, image, category_id } = data;
  const values = [id, name, description, price, image, category_id];
  await pool.query(
    "UPDATE items SET name = $2, description = $3, price = $4, image = $5, category_id = $6 WHERE id = $1",
    values
  );
}

// getItemsBySearch(query)

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

async function insertCategory(data) {
  const { name, description } = data;
  const values = [name, description];
  await pool.query(
    "INSERT INTO categories (name, description) VALUES ($1, $2)",
    values
  );
}

async function updateCategory(id, data) {
  const { name, description } = data;
  const values = [id, name, description];
  await pool.query(
    "UPDATE categories SET name = $2, description = $3 WHERE id = $1",
    values
  );
}

// generic
async function getRecord(table, id) {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [
    id,
  ]);
  return rows[0];
}

async function deleteRecord(table, id) {
  await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
}

module.exports = {
  getAllItems,
  getItemsByCategory,
  getFeaturedItem,
  insertItem,
  updateItem,
  getAllCategories,
  insertCategory,
  updateCategory,
  getRecord,
  deleteRecord,
};
