import express from "express";
import { Op } from "sequelize";

import Item from "../models/item.js";

const router = express.Router();

router.get("/basket", async (req, res) => {
  try {
    const basketItems = await Item.findAll({
      where: {
        quantity: {
          [Op.gt]: 0,
        },
      },
    });
    console.log("Basket items found:", basketItems);
    return res.status(200).json(basketItems);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching basket", error: err.message });
  }
});

router.post("/basket/add", async (req, res) => {
  try {
    const { itemUUID, requestedQuantity } = req.body;
    console.log(req.body);
    const item = await Item.findOne({
      where: {
        uuid: itemUUID,
      },
    });

    console.log("Item found:", item.name);
    item.quantity = requestedQuantity;
    await item.save();

    res.status(201).json({
      message: "Added to basket successfully",
      itemUUID,
      requestedQuantity,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding items to basket", error: err.message });
  }
});

router.post("/basket/clear", async (req, res) => {
  try {
    const basketItems = await Item.findAll({
      where: {
        quantity: {
          [Op.gt]: 0,
        },
      },
    });

    console.log("Item found:", basketItems);

    for (const item of basketItems) {
      item.quantity = 0;
      await item.save();
    }

    res.status(201).json({
      message: "Cleared basket successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding items to basket", error: err.message });
  }
});

export default router;
