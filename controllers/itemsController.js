const db = require("../db/queries");

exports.allItemsGet = async (req, res) => {
  const items = await db.getAllItems();
  res.render("items", { title: "All Items", items });
};

exports.itemsByCategoryGet = async (req, res) => {
  const { categoryId } = req.query;
  const category = await db.getRecord("categories", categoryId);
  const items = await db.getItemsByCategory(categoryId);
  res.render("items", { title: category.name, items });
};
