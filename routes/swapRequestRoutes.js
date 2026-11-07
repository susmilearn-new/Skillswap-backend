
const express = require("express");
const router = express.Router();

const {
  sendSwapRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
  cancelSwapRequest,
} = require("../controllers/swapRequestController");

const validateToken = require("../middleware/validateToken");

router.post("/", validateToken, sendSwapRequest);

router.get("/received", validateToken, getReceivedRequests);

router.get("/sent", validateToken, getSentRequests);

router.patch("/:id/status", validateToken, updateRequestStatus);

router.delete("/:id", validateToken, cancelSwapRequest);

module.exports = router;
