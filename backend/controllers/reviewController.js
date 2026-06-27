const Review = require("../models/review");
const Service = require("../models/service");

// Create Review
const createReview = async (req, res) => {
  try {

    const review = await Review.create({
      user: req.user.id,
      service: req.body.service,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await updateServiceRating(req.body.service);

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



// Get reviews for a service
const getServiceReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      service: req.params.serviceId
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Update Review
const updateReview = async (req, res) => {

  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    if (
      review.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();

    await updateServiceRating(review.service);

    res.status(200).json({
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

// Delete Review
const deleteReview = async (req, res) => {

  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    if (
      review.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const serviceId = review.service;

    await review.deleteOne();

    await updateServiceRating(serviceId);

    res.status(200).json({
      success: true,
      message: "Review deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const updateServiceRating = async (serviceId) => {
    const reviews = await Review.find({
        service: serviceId
    });

    let average = 0;

    if (reviews.length > 0) {
        const total = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        average = total / reviews.length;
    }

    await Service.findByIdAndUpdate(
        serviceId,
        {
            averageRating: average,
            reviewCount: reviews.length
        }
    );
};


module.exports = {
  createReview,
  getServiceReviews,
  updateReview,
  deleteReview
};