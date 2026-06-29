/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin Dashboard APIs
 */

const express = require("express");

const {
    getDashboardStats
} = require("../controllers/dashboardController");

const {
    protect,
    isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Returns overall statistics for the Sphere platform.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/stats",
    protect,
    isAdmin,
    getDashboardStats
);

module.exports = router;