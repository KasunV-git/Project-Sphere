const express = require("express");

const {
    getDashboardStats
} = require("../controllers/dashboardController");

const {
    protect,
    isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/stats",
    protect,
    isAdmin,
    getDashboardStats
);

module.exports = router;