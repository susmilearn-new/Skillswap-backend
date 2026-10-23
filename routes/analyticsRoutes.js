
const express = require("express");
const router = express.Router();

const { getSkillTrends } = require("../controllers/analyticsController");

router.get("/trends", getSkillTrends);

module.exports = router;
