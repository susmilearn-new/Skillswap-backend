
const User = require("../models/user");

const getSkillTrends = async (req, res) => {
  try {
    const users = await User.find().select(
      "skillsToTeach skillsToLearn"
    );

    const demandMap = {};
    const supplyMap = {};

    const addSkill = (map, skill) => {
      if (!skill || typeof skill !== "string") return;

      const cleanSkill = skill.trim();
      if (!cleanSkill) return;

      const existingKey = Object.keys(map).find(
        (key) => key.toLowerCase() === cleanSkill.toLowerCase()
      );

      const key = existingKey || cleanSkill;
      map[key] = (map[key] || 0) + 1;
    };

    users.forEach((user) => {
      (user.skillsToLearn || []).forEach((skill) =>
        addSkill(demandMap, skill)
      );

      (user.skillsToTeach || []).forEach((skill) =>
        addSkill(supplyMap, skill)
      );
    });

    const allSkills = new Set([
      ...Object.keys(demandMap),
      ...Object.keys(supplyMap),
    ]);

    const chartData = [...allSkills]
      .map((skill) => ({
        skill,
        Demand: demandMap[skill] || 0,
        Supply: supplyMap[skill] || 0,
      }))
      .sort((a, b) => b.Demand - a.Demand);

    const recommendations = [...chartData]
      .filter((item) => item.Demand > 0)
      .slice(0, 3)
      .map((item) => item.skill);

    const totalDemand = Object.values(demandMap)
      .reduce((sum, value) => sum + value, 0);

    const totalSupply = Object.values(supplyMap)
      .reduce((sum, value) => sum + value, 0);

    res.status(200).json({
      totalCategories: allSkills.size,
      totalLearners: users.length,
      totalDemand,
      totalSupply,
      chartData,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSkillTrends };
