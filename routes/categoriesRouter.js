const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");
const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.allCategoriesGet);
categoriesRouter.get("/:id", categoriesController.singleCategoryGet);

module.exports = categoriesRouter;
