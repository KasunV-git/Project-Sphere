/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorite Services APIs
 */

const express = require("express");

const router = express.Router();

const {
  addFavorite,
  getMyFavorites,
  removeFavorite
} = require("../controllers/favoriteController");

const {
  protect
} = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a service to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service
 *             properties:
 *               service:
 *                 type: string
 *                 example: 66a3eb5677dca27cf1d7452f6
 *     responses:
 *       201:
 *         description: Favorite added successfully
 *
 *   get:
 *     summary: Get my favorite services
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite services
 */
router.route("/")
  .post(protect, addFavorite)
  .get(protect, getMyFavorites);

/**
 * @swagger
 * /api/favorites/{serviceId}:
 *   delete:
 *     summary: Remove a service from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite removed successfully
 *       404:
 *         description: Favorite not found
 */
router.delete(
  "/:serviceId",
  protect,
  removeFavorite
);

module.exports = router;