const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent one user from reviewing the same service twice
reviewSchema.index(
  {
    user: 1,
    service: 1
  },
  {
    unique: true
  }
);

/* --------------------------------- */
reviewSchema.index({
    service:1
});

reviewSchema.index({
    createdAt:-1
});

module.exports = mongoose.model(
  "Review",
  reviewSchema
);