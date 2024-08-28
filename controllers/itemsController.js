const db = require("../db/queries");

exports.allItemsGet = async (req, res) => {
  const items = await db.getAllItems();
  res.render("items", { title: "All Items", items, category: null });
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
  res.render("createItem", { title: "Add Item", categories, item: null });
};

exports.createItemPost = async (req, res) => {
  // remember to add other inputs later
  const { name, description, category_id } = req.body;
  await db.insertItem(name, description, category_id);
  res.redirect("/items");
};

exports.updateItemGet = async (req, res) => {
  const { id } = req.params;
  const item = await db.getRecord("items", id);
  const categories = await db.getAllCategories();
  res.render("createItem", { title: "Update Item", categories, item });
};

exports.updateItemPost = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  await db.updateItem(id, data);
  res.redirect("/items");
};

exports.deleteItemPost = async (req, res) => {
  const { id } = req.params;
  await db.deleteRecord("items", id);
  res.redirect("/items");
};
