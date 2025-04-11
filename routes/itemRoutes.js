import express from "express";
import { Op } from "sequelize";

import Item from "../models/item.js";

const router = express.Router();

router.get("/items", async (req, res) => {
  try {
    const searchParam = req.query.search;
    // console.log("Search parameter received:", searchParam);

    const results = await Item.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${searchParam}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${searchParam}%`,
            },
          },
          {
            category: {
              [Op.iLike]: `%${searchParam}%`,
            },
          },
        ],
      },
    });

    // console.log("Raw results:", results);

    const filteredResults = results.map((item) => item.dataValues);

    // console.log("Search results:", filteredResults);
    // console.log("Number of results:", results.length);

    res.status(200).json(filteredResults);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching items", error: err.message });
  }
});

// DEV ROUTES

router.get("/dev/get-items", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.status(201).json(items);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error finding items", error: err.message });
  }
});

router.post("/dev/create-item", async (req, res) => {
  try {
    console.log("Creating item with data:", req.body);
    const { name, description, price, quantity, category, imageUrl } = req.body;
    const newItem = await Item.create({
      name,
      description,
      price,
      quantity,
      category,
      imageUrl,
    });
    res.status(201).json(newItem);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating items", error: err.message });
  }
});

router.post("/dev/create-items-bulk", async (req, res) => {
  try {
    console.log("Creating multiple items with data:", req.body);

    // Extract the objects from the request body
    const items = Object.values(req.body);

    // Use Sequelize's bulkCreate to insert all valid items
    const createdItems = await Item.bulkCreate(items, {
      validate: true, // Ensures only valid items are created
    });

    res.status(201).json({
      message: "Items created successfully",
      createdItems,
    });
  } catch (err) {
    console.error("Error creating multiple items:", err);
    res.status(500).json({
      message: "Error creating items",
      error: err.message,
    });
  }
});

router.delete("/dev/delete-item/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;
    console.log("Deleting item with UUID:", uuid);
    const item = await Item.destroy({ where: { uuid } });
    res.status(200).json({ message: "Item deleted successfully", item });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting items", error: err.message });
  }
});

export default router;
