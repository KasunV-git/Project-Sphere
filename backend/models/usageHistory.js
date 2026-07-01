const mongoose = require("mongoose");

const usageHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    usedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Faster lookup by service
usageHistorySchema.index({
  service: 1
});

// Faster sorting by usage date
usageHistorySchema.index({
  usedAt: -1
});

// Faster user history retrieval
usageHistorySchema.index({
  user: 1,
  usedAt: -1
});

module.exports = mongoose.model(
  "UsageHistory",
  usageHistorySchema
);