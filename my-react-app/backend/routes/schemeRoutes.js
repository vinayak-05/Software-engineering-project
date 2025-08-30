import express from "express";

const router = express.Router();

// Sample government schemes data
const schemesData = [
  {
    id: 1,
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme to provide financial support to farmers in case of crop failure due to natural calamities.",
    link: "https://pmfby.gov.in/"
  },
  {
    id: 2,
    title: "Kisan Credit Card Scheme",
    description: "Provides farmers with timely access to credit for agricultural and related activities.",
    link: "https://www.nabard.org/content1.aspx?id=597&catid=8&mid=8"
  },
  {
    id: 3,
    title: "National Mission for Sustainable Agriculture",
    description: "Promotes sustainable agriculture practices to make agriculture more productive and climate-resilient.",
    link: "https://nmsa.dac.gov.in/"
  },
  {
    id: 4,
    title: "Paramparagat Krishi Vikas Yojana",
    description: "Promotes organic farming practices among farmers and consumers.",
    link: "https://pgsindia-ncof.gov.in/PKVY/index.aspx"
  },
  {
    id: 5,
    title: "Pradhan Mantri Krishi Sinchai Yojana",
    description: "Ensures access to irrigation facilities for every farm and improving water use efficiency.",
    link: "https://pmksy.gov.in/"
  }
];

// 👉 Get all government schemes
router.get("/", async (req, res) => {
  try {
    res.json(schemesData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schemes" });
  }
});

export default router;
