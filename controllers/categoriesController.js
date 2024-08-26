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
