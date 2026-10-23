
const express = require("express");
const router = express.Router();

const { getUsers, getProfile, updateProfile} = require("../controllers/userController");

const validateToken = require("../middleware/validateToken");

router.get("/", getUsers);
router.get("/profile", validateToken, getProfile);
router.put("/profile", validateToken, updateProfile);

module.exports = router;
