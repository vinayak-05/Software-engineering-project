import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 👉 Price prediction using AI model
router.post("/predict", async (req, res) => {
  try {
    const { crop, location, quantity } = req.body;

    // Run Python script for prediction
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../../ai_model/price_predictor.py'),
      'predict',
      crop,
      location
    ], { cwd: path.join(__dirname, '../../ai_model') });

    let prediction = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      prediction += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Timeout after 30 seconds
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      res.status(500).json({ message: "Prediction timeout" });
    }, 30000);

    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        console.error('Python script error:', error);
        return res.status(500).json({ message: "Error running AI model" });
      }

      const predictedPrice = parseFloat(prediction.trim());
      if (isNaN(predictedPrice)) {
        return res.status(500).json({ message: "Invalid prediction from AI model" });
      }

      // Adjust based on quantity (simple multiplier)
      const totalPrice = predictedPrice * quantity;

      res.json({
        crop,
        location,
        quantity,
        pricePerKg: predictedPrice,
        totalPrice
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error predicting price" });
  }
});

export default router;
