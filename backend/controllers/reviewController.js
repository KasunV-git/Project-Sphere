const Review = require("../models/review");
const Service = require("../models/service");

// Create Review
const createReview = async (req, res, next) => {
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

    next(error);

  }
};



// Get reviews for a service
const getServiceReviews = async (req, res, next) => {
  try {

    const reviews = await Review.find({
      service: req.params.serviceId
    })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {

    next(error);

  }
};

// Update Review
const updateReview = async (req, res, next) => {

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

    next(error);

  }

};

// Delete Review
const deleteReview = async (req, res, next) => {

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

    next(error);

  }

};

const updateServiceRating = async (serviceId) => {
    const reviews = await Review.find({
        service: serviceId
    })
    .select("rating")
    .lean();

    let average = 0;

    if (reviews.length > 0) {
        const total = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        average = Number((total / reviews.length).toFixed(1));
    }

    await Service.findByIdAndUpdate(
        serviceId,
        {
            averageRating: average,
            reviewCount: reviews.length
        },
        {
          runValidators: true
        }
    );
};


module.exports = {
  createReview,
  getServiceReviews,
  updateReview,
  deleteReview
};