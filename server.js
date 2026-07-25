require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
  })
);

// Save User
app.post("/submit", async (req, res) => {
  await User.create({
    name: req.body.name,
    email: req.body.email,
  });

  res.redirect("/");
});

// Get All Users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get Single User
app.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Update User
app.put("/update/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
  });

  res.json({
    message: "User Updated Successfully",
  });
});

// Delete User
app.delete("/delete/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({
    message: "Deleted Successfully",
  });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server Running on Port 3000");
});
// PROD CI/CD TEST
