const UsageHistory = require("../models/usageHistory");

// Record service usage
const recordUsage = async (req, res, next) => {
  try {

    const usage = await UsageHistory.create({
      user: req.user.id,
      service: req.body.service
    });

    res.status(201).json({
      success: true,
      usage
    });

  } catch (error) {

    next(error);

  }
};

// Get logged in user's history
const getMyHistory = async (req, res, next) => {
  try {

    const history = await UsageHistory.find({
      user: req.user.id
    })
      .populate("service")
      .sort({ usedAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });

  } catch (error) {

    next(error);

  }
};

// Admin - Get all history
const getAllHistory = async (req, res, next) => {
  try {

    const history = await UsageHistory.find()
      .populate("user", "name email role")
      .populate("service", "name slug")
      .sort({ usedAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });

  } catch (error) {

    next(error);

  }
};

// Admin - Delete usage
const deleteHistory = async (req, res, next) => {
  try {

    const history = await UsageHistory.findByIdAndDelete(
      req.params.id
    );

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "History deleted"
    });

  } catch (error) {

    next(error);

  }
};

module.exports = {
  recordUsage,
  getMyHistory,
  getAllHistory,
  deleteHistory
};