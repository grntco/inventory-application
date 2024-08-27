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

async function insertItem(name, description, category_id) {
  await pool.query(
    "INSERT INTO items (name, description, category_id) VALUES($1, $2, $3)",
    [name, description, category_id]
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

// generic
async function getRecord(table, id) {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [
    id,
  ]);
  return rows[0];
}

module.exports = {
  getAllItems,
  getItemsByCategory,
  insertItem,
  getAllCategories,
  insertCategory,
  getRecord,
};
