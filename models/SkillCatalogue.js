const mongoose = require("mongoose");

const skillCatalogueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SkillCatalogue",
  skillCatalogueSchema
);