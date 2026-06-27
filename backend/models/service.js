const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    slug: {
      type: String,
      required: true,
      unique: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    icon: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },

    averageRating: {
    type: Number,
    default: 0
    },

    reviewCount: {
    type: Number,
    default: 0
    },
    
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Service",
  serviceSchema
);