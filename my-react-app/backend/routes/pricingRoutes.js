import express from "express";

const router = express.Router();

// 👉 Price prediction demo endpoint
router.post("/predict", async (req, res) => {
  try {
    const { crop, location, quantity } = req.body;
    
    // Simple demo pricing logic
    const basePrices = {
      'wheat': 25,
      'rice': 30,
      'corn': 20,
      'potato': 15,
      'tomato': 40,
      'default': 25
    };

    const pricePerKg = basePrices[crop.toLowerCase()] || basePrices.default;
    const totalPrice = pricePerKg * quantity;

    res.json({
      crop,
      location,
      quantity,
      pricePerKg,
      totalPrice
    });
  } catch (error) {
    res.status(500).json({ message: "Error predicting price" });
  }
});

export default router;
