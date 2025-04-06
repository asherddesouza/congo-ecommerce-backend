const express = require("express");
// const { Sequelize } = require("sequelize");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
// const sequelize = new Sequelize(
//   "postgres://postgres:password@localhost:5432/mydb"
// );

// API Routes
app.get("/home", async (req, res) => {
  try {
    res.status(200).json({ message: "BACKEND CONNECTED" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server is running on port ${PORT}`);
});
