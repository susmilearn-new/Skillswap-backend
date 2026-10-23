
const express = require("express");
const router = express.Router();

const { getMatches } = require("../controllers/matchController");
const validateToken = require("../middleware/validateToken");

router.get("/", validateToken, getMatches);

module.exports = router;
