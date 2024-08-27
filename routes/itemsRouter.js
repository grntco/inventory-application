const { Router } = require("express");
const itemsRouter = Router();
const itemsController = require("../controllers/itemsController");

itemsRouter.get("/", itemsController.allItemsGet);
itemsRouter.get("/new", itemsController.createItemGet);
itemsRouter.post("/new", itemsController.createItemPost);
itemsRouter.get("/:id", itemsController.singleItemGet);
itemsRouter.get("/:id/update", itemsController.updateItemGet);
itemsRouter.post("/:id/update", itemsController.updateItemPost);
itemsRouter.post("/:id/delete", itemsController.deleteItemPost);

module.exports = itemsRouter;
