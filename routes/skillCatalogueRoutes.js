const express = require("express");
const router = express.Router();

const {
  createCatalogueSkill,
  getCatalogueSkills,
  updateCatalogueSkill,
  deleteCatalogueSkill,
} = require("../controllers/skillCatalogueController");

const validateToken = require("../middleware/validateToken");
const isAdmin = require("../middleware/isAdmin");

// Public: Anyone can view available skills
router.get("/", getCatalogueSkills);

// Admin only: Manage catalogue
router.post("/", validateToken, isAdmin, createCatalogueSkill);
router.put("/:id", validateToken, isAdmin, updateCatalogueSkill);
router.delete("/:id", validateToken, isAdmin, deleteCatalogueSkill);

module.exports = router;