
const User = require("../models/user");
const mongoose = require("mongoose");

// Get all public profiles
const getUsers = async (req, res) => {
  try {
    console.log("Logged-in user:", req.user);

    const users = await User.find({
      _id: { $ne: req.user.id },
    }).select("-password");

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get one profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update logged-in user's profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "place",
      "description",
      "category",
      "skillsToTeach",
      "skillsToLearn",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save a community profile
const saveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Prevent saving your own profile
    if (userId === loggedInUserId) {
      return res.status(400).json({
        message: "You cannot save your own profile",
      });
    }

    // Check whether the profile exists
    const userToSave = await User.findById(userId);

    if (!userToSave) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // $addToSet prevents duplicate entries
    await User.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { savedUsers: userId },
    });

    res.status(200).json({
      message: "Profile saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Remove a saved profile
const removeSavedUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { savedUsers: userId },
    });

    res.status(200).json({
      message: "Profile removed from saved list",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get all saved profiles
const getSavedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("savedUsers")
      .populate("savedUsers", "-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      count: user.savedUsers.length,
      users: user.savedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getProfile,
  updateProfile,
  saveUser,
  removeSavedUser,
  getSavedUsers,
};
