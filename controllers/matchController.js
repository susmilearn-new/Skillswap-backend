
const User = require("../models/user");

const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id)
      .select("-password");

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const users = await User.find({
      _id: { $ne: currentUser._id },
    }).select("-password");

    const myTeach = currentUser.skillsToTeach || [];
    const myLearn = currentUser.skillsToLearn || [];

    const normalize = (skill) => skill.trim().toLowerCase();

    const matches = users
      .map((user) => {
        const userTeach = user.skillsToTeach || [];
        const userLearn = user.skillsToLearn || [];

        const userTeaches = myLearn.filter((skill) =>
          userTeach.some(
            (item) => normalize(item) === normalize(skill)
          )
        );

        const matchTeaches = myTeach.filter((skill) =>
          userLearn.some(
            (item) => normalize(item) === normalize(skill)
          )
        );

        const totalMatches =
          userTeaches.length + matchTeaches.length;

        if (totalMatches === 0) {
          return null;
        }

        const matchPercentage =
          totalMatches >= 2 ? 85 : 60;

        return {
          id: user._id,
          name: user.name,
          place: user.place,
          description: user.description,
          category: user.category,
          skillsToTeach: userTeach,
          skillsToLearn: userLearn,
          userTeaches,
          matchTeaches,
          totalMatches,
          matchPercentage,
          scoreLabel:
            matchPercentage >= 85 ? "Great" : "Good",
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) => b.matchPercentage - a.matchPercentage
      );

    res.status(200).json({
      count: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMatches };
