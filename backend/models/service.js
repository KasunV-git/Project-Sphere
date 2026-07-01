const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    icon: {
      type: String,
      default: "",
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    averageRating: {
    type: Number,
    default: 0,
    index: true
    },

    reviewCount: {
    type: Number,
    default: 0,
    index: true
    },
    
  },
  {
    timestamps: true
  }
);

// Faster sorting by newest services
serviceSchema.index({
  createdAt: -1
});

// Faster filtering by category and active status
serviceSchema.index({
  category: 1,
  isActive: 1
});

module.exports = mongoose.model(
  "Service",
  serviceSchema
);