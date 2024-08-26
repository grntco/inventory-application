require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;
const itemsRouter = require("./routes/itemsRouter");

app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use("/items", itemsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
