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

async function insertItem(data) {
  const { name, description, price, quantity, image, category_id } = data;
  const values = [name, description, price, quantity, image, category_id];
  await pool.query(
    "INSERT INTO items (name, description, price, quantity, image, category_id) VALUES($1, $2, $3, $4, $5, $6)",
    values
  );
}

async function updateItem(id, data) {
  const { name, description, price, quantity, image, category_id } = data;
  const values = [id, name, description, price, quantity, image, category_id];
  await pool.query(
    "UPDATE items SET name = $2, description = $3, price = $4, quantity = $5, image = $6, category_id = $7 WHERE id = $1",
    values
  );
}

// getItemsBySearch(query)

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

async function insertCategory(name) {
  await pool.query("INSERT INTO categories (name) VALUES ($1)", [name]);
}

async function updateCategory(id, data) {
  const { name } = data;
  await pool.query("UPDATE categories SET name = $2 WHERE id = $1", [id, name]);
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
  insertItem,
  updateItem,
  getAllCategories,
  insertCategory,
  updateCategory,
  getRecord,
  deleteRecord,
};
