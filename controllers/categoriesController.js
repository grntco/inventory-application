const db = require("../db/queries");

exports.allCategoriesGet = async (req, res) => {
  const categories = await db.getAllCategories();
  const categoriesWithImages = await Promise.all(
    categories.map(async (category) => {
      const featuredItem = await db.getFeaturedItem(category.id);
      category.image = featuredItem.image ?? "/images/lego.png";
      return category;
    })
  );
  res.render("categories", {
    title: "All Categories",
    categories: categoriesWithImages,
  });
};

exports.singleCategoryGet = async (req, res) => {
  const { id } = req.params;
  const category = await db.getRecord("categories", id);
  const items = await db.getItemsByCategory(id);
  res.render("items", { title: `Items in ${category.name}`, items, category });
};

exports.createCategoryGet = async (req, res) => {
  res.render("createCategory", { title: "Add New Category", category: null });
};

exports.createCategoryPost = async (req, res) => {
  // remember to add other inputs later
  const { name } = req.body;
  await db.insertCategory(name);
  res.redirect("/categories");
};

exports.updateCategoryGet = async (req, res) => {
  const { id } = req.params;
  const category = await db.getRecord("categories", id);
  res.render("createCategory", { title: "Update Category", category });
};

exports.updateCategoryPost = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  await db.updateCategory(id, data);
  res.redirect("/categories");
};

exports.deleteCategoryPost = async (req, res) => {
  const { id } = req.params;
  await db.deleteRecord("categories", id);
  res.redirect("/categories");
};
