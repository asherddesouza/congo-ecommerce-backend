import dotenv from "dotenv";
dotenv.config();

import express from "express";
import sequelize from "./database.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/", userRoutes);
app.use("/", itemRoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server is running on port ${PORT}`);

    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  });
});
