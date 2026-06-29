const express = require("express");

const {
    getTopServices,
    getTopRatedServices,
    getMostFavoritedServices,
    getUsageTrends
} = require("../controllers/analyticsController");

const {
    protect,
    isAdmin
} = require("../middleware/authMiddleware");



const router = express.Router();

router.get(
    "/top-services",
    protect,
    isAdmin,
    getTopServices
);


router.get(
    "/top-rated",
    protect,
    isAdmin,
    getTopRatedServices
);

router.get(
    "/most-favorited",
    protect,
    isAdmin,
    getMostFavoritedServices
);

router.get(
    "/usage-trends",
    protect,
    isAdmin,
    getUsageTrends
);

module.exports = router;