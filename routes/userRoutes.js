import express from "express";

import User from "../models/user.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { uuid, name, email, password } = req.body;
    const newUser = await User.create({ uuid, name, email, password });
    res.status(201).json(newUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

export default router;
