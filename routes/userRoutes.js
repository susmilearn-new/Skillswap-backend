
const express = require("express");
const router = express.Router();

const { getUsers, getProfile, updateProfile, saveUser, removeSavedUser, getSavedUsers} = require("../controllers/userController");

const validateToken = require("../middleware/validateToken");

router.get("/", validateToken, getUsers);
router.get("/profile", validateToken, getProfile);
router.put("/profile", validateToken, updateProfile);

// Saved profiles
router.get("/saved", validateToken, getSavedUsers);
router.post("/saved/:userId", validateToken, saveUser);
router.delete("/saved/:userId", validateToken, removeSavedUser);

module.exports = router;
