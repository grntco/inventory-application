const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");
const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.allCategoriesGet);
categoriesRouter.get("/new", categoriesController.createCategoryGet);
categoriesRouter.post("/new", categoriesController.createCategoryPost);
categoriesRouter.get("/:id", categoriesController.singleCategoryGet);
categoriesRouter.get("/:id/update", categoriesController.updateCategoryGet);
categoriesRouter.post("/:id/update", categoriesController.updateCategoryPost);
categoriesRouter.post("/:id/delete", categoriesController.deleteCategoryPost);

module.exports = categoriesRouter;
