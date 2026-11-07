
const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        skillOffered: {
            type: String,
            required: true,
            trim: true,
        },

        skillWanted: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "cancelled"],
            default: "pending",
        },
        message: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
