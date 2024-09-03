const db = require("../db/queries");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const { title } = require("process");

const upload = multer({ dest: "uploads/" }); // Temporary storage

const validateItem = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Please provide a category name.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters."),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Please provide a category description")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters."),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Please provide a price (without $).")
    .isFloat({ min: 0.01, max: 10000.0 })
    .withMessage("Please provide a valid price between 0.01 and 10000.00.")
    .custom((value) => {
      return /^\d+(\.\d{2})$/.test(value);
    })
    .withMessage("Please provide a valid price with two decimal places."),
  body("category_id")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Please select a category")
    .isNumeric()
    .withMessage("Please select a valid category from the listed options."),
];

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
  res.render("createItem", { title: "Add Item", categories });
};

exports.createItemPost = [
  upload.single("image"),
  validateItem,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await db.getAllCategories();

      return res.status(400).render("createItem", {
        title: "Create Item",
        categories,
        errors: errors.array(),
      });
    }
    const data = dataWithImageFilePath(req);
    purgeTempStorage();

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
  validateItem,
  async (req, res) => {
    const { id } = req.params;
    const item = await db.getRecord("items", id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const categories = await db.getAllCategories();

      return res.status(400).render("createItem", {
        title: "Update Item",
        categories,
        item,
        errors: errors.array(),
      });
    }

    let data = req.body;
    const previousImage = item.image ?? "";
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
        purgeTempStorage();
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

function purgeTempStorage() {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      console.error("Unable to read directory:", err);
      return;
    }

    files.forEach((file) => {
      fs.rm(
        path.join("uploads", file),
        { recursive: true, force: true },
        (err) => {
          if (err) {
            console.error(`Unable to delete ${file}:`, err);
          }
        }
      );
    });
  });
}
