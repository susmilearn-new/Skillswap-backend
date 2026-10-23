
const express = require("express");
const router = express.Router();

const { createSkill, getSkills, getSkillById, updateSkill, deleteSkill} = require("../controllers/skillController");

const validateToken = require("../middleware/validateToken");

// Public routes
router.get("/", getSkills);
router.get("/:id", getSkillById);

// Login required
router.post("/", validateToken, createSkill);
router.put("/:id", validateToken, updateSkill);
router.delete("/:id", validateToken, deleteSkill);

module.exports = router;
