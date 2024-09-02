const db = require("../db/queries");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
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
    const data = dataWithImageFilePath(req);

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

exports.updateItemPost = [
  upload.single("image"),
  async (req, res) => {
    let data = req.body;
    const { id } = req.params;
    const item = await db.getRecord("items", id);
    const previousImage = item.image;
    const previousImagePath = path.join("public", previousImage);

    if (!req.file) {
      try {
        console.log("no new file, previous image should exist");
        await fsPromises.access(previousImagePath);
        data.image = previousImage;
      } catch (err) {
        console.log("no new file, previous image does not exist");
        data.image = "";
      }
    } else {
      try {
        console.log("new image, old image should be deleted");
        await fsPromises.access(previousImagePath);
        await deleteItemImageFile(id);
      } catch (err) {
        console.log("new image, but no old image to delete");
      }
      data = dataWithImageFilePath(req);
    }
    await db.updateItem(id, data);
    res.redirect("/items");
  },
];

exports.deleteItemPost = async (req, res) => {
  const { id } = req.params;
  await deleteItemImageFile(id);
  await db.deleteRecord("items", id);
  res.redirect("/items");
};

function dataWithImageFilePath(req) {
  const data = req.body;

  if (req.file) {
    const targetDir = path.join(__dirname, "..", "public", "images");
    const targetPath = path.join(targetDir, req.file.originalname);

    fs.mkdirSync(targetDir, { recursive: true });
    fs.renameSync(req.file.path, targetPath);

    data.image = path.join("/", "images", req.file.originalname);
  }

  return data;
}

async function deleteItemImageFile(id) {
  const item = await db.getRecord("items", id);
  const imagePath = item?.image;
  if (imagePath) {
    await fsPromises.rm(path.join(__dirname, "..", "public", imagePath));
  }
}
