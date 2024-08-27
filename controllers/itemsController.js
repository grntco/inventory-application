const db = require("../db/queries");

exports.allItemsGet = async (req, res) => {
  const items = await db.getAllItems();
  res.render("items", { title: "All Items", items });
};

exports.singleItemGet = async (req, res) => {
  const { id } = req.params;
  const item = await db.getRecord("items", id);
  res.render("singleItem", { item });
};

exports.itemsByCategoryGet = async (req, res) => {
  const { id } = req.params;
  const category = await db.getRecord("categories", id);
  const items = await db.getItemsByCategory(id);
  res.render("items", { title: category.name, items });
};

exports.createItemGet = async (req, res) => {
  const categories = await db.getAllCategories();
  res.render("createItem", { title: "Add New Item", categories });
};

exports.createItemPost = async (req, res) => {
  // remember to add other inputs later
  const { name, description, category_id } = req.body;
  await db.insertItem(name, description, category_id);
  res.redirect("/items");
};
