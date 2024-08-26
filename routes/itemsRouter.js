const { Router } = require("express");
const itemsRouter = Router();
const itemsController = require("../controllers/itemsController");

itemsRouter.get("/", itemsController.allItemsGet);
itemsRouter.get("/:id", itemsController.singleItemGet);

module.exports = itemsRouter;
