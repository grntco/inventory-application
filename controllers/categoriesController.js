const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Please provide a category name")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters."),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Please provide a category description")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters."),
];

exports.allCategoriesGet = async (req, res) => {
  const categories = await db.getAllCategories();
  const categoriesWithImages = await Promise.all(
    categories.map(async (category) => {
      const featuredItem = await db.getFeaturedItem(category.id);
      category.image = featuredItem?.image ?? "/images/lego.png";
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
  res.render("createCategory", {
    title: "Add New Category",
  });
};

exports.createCategoryPost = [
  validateCategory,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createCategory", {
        title: "Add New Category",
        errors: errors.array(),
      });
    }
    const data = req.body;
    await db.insertCategory(data);
    res.redirect("/categories");
  },
];

exports.updateCategoryGet = async (req, res) => {
  const { id } = req.params;
  const category = await db.getRecord("categories", id);
  res.render("createCategory", { title: "Update Category", category });
};

exports.updateCategoryPost = [
  validateCategory,
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const category = await db.getRecord("categories", id);
      return res.status(400).render("createCategory", {
        title: "Update Category",
        category,
        errors: errors.array(),
      });
    }
    const data = req.body;
    await db.updateCategory(id, data);
    res.redirect("/categories");
  },
];

exports.deleteCategoryPost = async (req, res) => {
  const { id } = req.params;
  await db.deleteRecord("categories", id);
  res.redirect("/categories");
};
