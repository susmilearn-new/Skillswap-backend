
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    place: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    skillsToTeach: {
      type: [String],
      default: [],
    },

    skillsToLearn: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    sessions: {
      type: Number,
      default: 0,
      min: 0,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    savedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
