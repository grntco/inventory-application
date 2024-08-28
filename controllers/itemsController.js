const db = require("../db/queries");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const upload = multer({ dest: "uploads/" }); // Temporary storage

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

exports.createItemPost = [
  upload.single("image"),
  async (req, res) => {
    const data = req.body;
    console.log(req.file);
    if (req.file) {
      const targetDir = path.join(__dirname, "..", "public", "images");
      const targetPath = path.join(targetDir, req.file.originalname);

      fs.mkdirSync(targetDir, { recursive: true });
      fs.renameSync(req.file.path, targetPath);

      data.image = path.join("/", "images", req.file.originalname);
    }

    await db.insertItem(data);
    res.redirect("/items");
  },
];

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
