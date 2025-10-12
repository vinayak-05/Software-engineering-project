import express from "express";
import Cart from "../models/Cart.js";
import Crop from "../models/Crop.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// GET /api/cart - Get user's cart
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.crop",
      select: "name price quantity image",
    });
    if (!cart) {
      return res.json({ items: [], total: 0 });
    }
    const total = cart.items.reduce((sum, item) => {
      if (item.crop && item.crop.price) {
        return sum + item.crop.price * item.quantity;
      }
      return sum;
    }, 0);
    res.json({ items: cart.items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// POST /api/cart/add - Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { cropId, quantity } = req.body;
    if (!cropId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid cropId or quantity" });
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    if (crop.quantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.crop.toString() === cropId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ crop: cropId, quantity });
    }

    await cart.save();
    await cart.populate({
      path: "items.crop",
      select: "name price quantity image",
    });

    const total = cart.items.reduce((sum, item) => {
      if (item.crop && item.crop.price) {
        return sum + item.crop.price * item.quantity;
      }
      return sum;
    }, 0);
    res.json({ message: "Item added to cart", cart: { items: cart.items, total } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// PUT /api/cart/update/:itemId - Update item quantity in cart
router.put("/update/:itemId", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const crop = await Crop.findById(item.crop);
    if (!crop || crop.quantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate({
      path: "items.crop",
      select: "name price quantity image",
    });

    const total = cart.items.reduce((sum, item) => {
      if (item.crop && item.crop.price) {
        return sum + item.crop.price * item.quantity;
      }
      return sum;
    }, 0);
    res.json({ message: "Cart updated", cart: { items: cart.items, total } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart" });
  }
});

// DELETE /api/cart/remove/:itemId - Remove item from cart
router.delete("/remove/:itemId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate({
      path: "items.crop",
      select: "name price quantity image",
    });

    const total = cart.items.reduce((sum, item) => {
      if (item.crop && item.crop.price) {
        return sum + item.crop.price * item.quantity;
      }
      return sum;
    }, 0);
    res.json({ message: "Item removed from cart", cart: { items: cart.items, total } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing from cart" });
  }
});

export default router;
