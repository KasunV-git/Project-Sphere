const express = require("express");

const {

  createReview,
  getServiceReviews,
  updateReview,
  deleteReview

} = require("../controllers/reviewController");

const {

  protect

} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createReview
);

router.get(
  "/service/:serviceId",
  getServiceReviews
);

router.put(
  "/:id",
  protect,
  updateReview
);

router.delete(
  "/:id",
  protect,
  deleteReview
);

module.exports = router;