require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;
const itemsRouter = require("./routes/itemsRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const db = require("./db/queries");

app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const featuredItem = await db.getFeaturedItem();
  console.log(featuredItem);
  res.render("index", {
    title: "Home",
    item: featuredItem,
  });
});

app.use("/items", itemsRouter);
app.use("/categories", categoriesRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
