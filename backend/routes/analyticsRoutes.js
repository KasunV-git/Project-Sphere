/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics APIs for the Sphere Admin Dashboard
 */

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

/**
 * @swagger
 * /api/analytics/top-services:
 *   get:
 *     summary: Get the most used services
 *     description: Returns the top services ranked by usage count.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top services retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/top-services",
    protect,
    isAdmin,
    getTopServices
);

/**
 * @swagger
 * /api/analytics/top-rated:
 *   get:
 *     summary: Get the highest rated services
 *     description: Returns services ordered by average rating.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top rated services retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/top-rated",
    protect,
    isAdmin,
    getTopRatedServices
);

/**
 * @swagger
 * /api/analytics/most-favorited:
 *   get:
 *     summary: Get the most favorited services
 *     description: Returns services ordered by number of favorites.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Most favorited services retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/most-favorited",
    protect,
    isAdmin,
    getMostFavoritedServices
);

/**
 * @swagger
 * /api/analytics/usage-trends:
 *   get:
 *     summary: Get usage trends
 *     description: Returns aggregated service usage data grouped by date for dashboard charts.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usage trends retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/usage-trends",
    protect,
    isAdmin,
    getUsageTrends
);

module.exports = router;