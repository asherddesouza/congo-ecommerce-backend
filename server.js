import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import sequelize from "./database.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import basketRoutes from "./routes/basketRoutes.js";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevents XSS attacks
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1-day expiration for the session cookie
    },
  })
);

app.use(express.json());

app.use("/", userRoutes);
app.use("/", itemRoutes);
app.use("/", basketRoutes);

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
