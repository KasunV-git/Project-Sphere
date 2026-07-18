/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category Management APIs
 */

const express = require("express");
const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Student Tools
 *               description:
 *                 type: string
 *                 example: Tools for university students
 *               icon:
 *                 type: string
 *                 example: graduation-cap
 *     responses:
 *       201:
 *         description: Category created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.route("/")
  .post(protect, isAdmin, createCategory)
  .get(getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 *
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 *
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.route("/:id")
  .get(getCategoryById)
  .put(protect, isAdmin, updateCategory)
  .delete(protect, isAdmin, deleteCategory);

module.exports = router;