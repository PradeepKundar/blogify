const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

const userRouter = require("./routes/user");
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("error occured", err.message));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server started at PORT : ${PORT}`);
});
