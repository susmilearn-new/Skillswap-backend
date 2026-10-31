
const Skill = require("../models/skill");

// Create a new skill
const createSkill = async (req, res) => {
  try {
    const { title, category, description, tags, level } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        message: "Title, category and description are required",
      });
    }

    const skill = await Skill.create({
      title,
      category,
      description,
      tags: tags || [],
      level: level || "Beginner",
      user: req.user.id,
    });

    res.status(201).json({
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all skills with search and filters
const getSkills = async (req, res) => {
  try {
    const { search, category, level } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    const skills = await Skill.find(filter)
      .populate("user", "name place")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: skills.length,
      skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one skill
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate("user", "name place");

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a skill
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    if (skill.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own skills",
      });
    }

    const { title, category, description, tags, level } = req.body;

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { title, category, description, tags, level },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Skill updated successfully",
      skill: updatedSkill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a skill
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    if (skill.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own skills",
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill
};
