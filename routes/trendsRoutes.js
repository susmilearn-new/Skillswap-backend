
const express = require("express");
const router = express.Router();

const {
  analyzeTrends,
  generateLearningPath,
} = require("../controllers/trendsController");

const validateToken = require("../middleware/validateToken");

router.post("/analyze", validateToken, analyzeTrends);

// AI learning path
router.get("/learning-path", validateToken, generateLearningPath);

module.exports = router;
