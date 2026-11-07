
const SwapRequest = require("../models/SwapRequest");
const User = require("../models/user");

// 1. Send a swap request
const sendSwapRequest = async (req, res) => {
  try {
    const { receiver, skillOffered, skillWanted, message} = req.body;

    if (!receiver || !skillOffered || !skillWanted) {
      return res.status(400).json({
        message: "Receiver, skill offered and skill wanted are required",
      });
    }

    if (String(receiver) === String(req.user.id)) {
      return res.status(400).json({
        message: "You cannot send a request to yourself",
      });
    }

    const receiverExists = await User.findById(receiver);

    if (!receiverExists) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const existingRequest = await SwapRequest.findOne({
      sender: req.user.id,
      receiver,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "You already have a pending request with this user",
      });
    }

    const request = await SwapRequest.create({
      sender: req.user.id,
      receiver,
      skillOffered,
      skillWanted,
      message,
    });

    res.status(201).json({
      message: "Swap request sent successfully",
      request,
    });
  } catch (error) {
    console.error("Send request error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Get received requests
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      receiver: req.user.id,
    })
      .populate("sender", "name email place")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Received requests error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 3. Get sent requests
const getSentRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      sender: req.user.id,
    })
      .populate("receiver", "name email place")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Sent requests error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 4. Accept or reject a received request
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected",
      });
    }

    const request = await SwapRequest.findOne({
      _id: req.params.id,
      receiver: req.user.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "Pending request not found",
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: `Request ${status} successfully`,
      request,
    });
  } catch (error) {
    console.error("Update request error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 5. Cancel a sent request
const cancelSwapRequest = async (req, res) => {
  try {
    const request = await SwapRequest.findOne({
      _id: req.params.id,
      sender: req.user.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "Pending request not found",
      });
    }

    request.status = "cancelled";
    await request.save();

    res.status(200).json({
      message: "Swap request cancelled successfully",
      request,
    });
  } catch (error) {
    console.error("Cancel request error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendSwapRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
  cancelSwapRequest,
};
