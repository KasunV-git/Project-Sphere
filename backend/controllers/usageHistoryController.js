const UsageHistory = require("../models/usageHistory");

// Record a service usage
const recordUsage = async (req, res) => {
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

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  recordUsage
};