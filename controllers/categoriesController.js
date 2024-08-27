const db = require("../db/queries");

exports.allCategoriesGet = async (req, res) => {
  const categories = await db.getAllCategories();
  res.render("categories", { title: "All Categories", categories });
};

exports.singleCategoryGet = async (req, res) => {
  const { id } = req.params;
  const category = await db.getRecord("categories", id);
  const items = await db.getItemsByCategory(id);
  res.render("items", { title: category.name, items });
};

exports.createCategoryGet = async (req, res) => {
  res.render("createCategory", { title: "Add New Category" });
};

exports.createCategoryPost = async (req, res) => {
  // remember to add other inputs later
  const { name } = req.body;
  await db.insertCategory(name);
  res.redirect("/categories");
};
