const SkillCatalogue = require("../models/SkillCatalogue");

// Admin: Add a skill
const createCatalogueSkill = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        message: "Title and category are required",
      });
    }

    const existingSkill = await SkillCatalogue.findOne({
      title: { $regex: `^${title.trim()}$`, $options: "i" },
    });

    if (existingSkill) {
      return res.status(409).json({
        message: "This skill already exists",
      });
    }

    const skill = await SkillCatalogue.create({
      title,
      category,
    });

    res.status(201).json({
      message: "Skill added successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: Get all catalogue skills
const getCatalogueSkills = async (req, res) => {
  try {
    const skills = await SkillCatalogue.find().sort({
      title: 1,
    });

    res.status(200).json({
      count: skills.length,
      skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update a catalogue skill
const updateCatalogueSkill = async (req, res) => {
  try {
    const { title, category } = req.body;

    const skill = await SkillCatalogue.findByIdAndUpdate(
      req.params.id,
      { title, category },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json({
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete a catalogue skill
const deleteCatalogueSkill = async (req, res) => {
  try {
    const skill = await SkillCatalogue.findByIdAndDelete(
      req.params.id
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCatalogueSkill,
  getCatalogueSkills,
  updateCatalogueSkill,
  deleteCatalogueSkill,
};