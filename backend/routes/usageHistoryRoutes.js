/**
 * @swagger
 * tags:
 *   name: Usage History
 *   description: APIs for recording and managing service usage history
 */

const express = require("express");

const {
  recordUsage,
  getMyHistory,
  getAllHistory,
  deleteHistory
} = require("../controllers/usageHistoryController");

const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/usage:
 *   post:
 *     summary: Record service usage
 *     tags: [Usage History]
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
 *         description: Usage recorded successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, recordUsage);

/**
 * @swagger
 * /api/usage/me:
 *   get:
 *     summary: Get logged-in user's usage history
 *     tags: [Usage History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User usage history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/me", protect, getMyHistory);

/**
 * @swagger
 * /api/usage:
 *   get:
 *     summary: Get all usage history (Admin only)
 *     tags: [Usage History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all usage history
 *       403:
 *         description: Admin access required
 */
router.get("/", protect, isAdmin, getAllHistory);

/**
 * @swagger
 * /api/usage/{id}:
 *   delete:
 *     summary: Delete a usage history record (Admin only)
 *     tags: [Usage History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Usage history ID
 *     responses:
 *       200:
 *         description: Usage history deleted successfully
 *       404:
 *         description: Usage history not found
 */
router.delete("/:id", protect, isAdmin, deleteHistory);

module.exports = router;