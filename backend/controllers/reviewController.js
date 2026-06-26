const Review = require("../models/review");

// Create Review
const createReview = async (req, res) => {
  try {

    const review = await Review.create({
      user: req.user.id,
      service: req.body.service,
      rating: req.body.rating,
      comment: req.body.comment
    });

    res.status(201).json({
      success: true,
      review
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  createReview
};