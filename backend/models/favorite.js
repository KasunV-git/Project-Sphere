const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Prevent duplicate favorites
favoriteSchema.index(
  {
    user: 1,
    service: 1
  },
  {
    unique: true
  }
);

// Faster analytics by service
favoriteSchema.index({
  service: 1
});

module.exports = mongoose.model(
  "Favorite",
  favoriteSchema
);