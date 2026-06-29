/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service Management APIs
 */

const express = require("express");

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} = require("../controllers/serviceController");

const {
  validateCreateService,
  validateUpdateService,
  handleValidationErrors
} = require("../validation/serviceValidation");

const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
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
 *               - slug
 *               - description
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: GPA Calculator
 *               slug:
 *                 type: string
 *                 example: gpa-calculator
 *               description:
 *                 type: string
 *                 example: Calculate semester GPA
 *               category:
 *                 type: string
 *                 example: 66abc1234567890123456789
 *     responses:
 *       201:
 *         description: Service created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */

router.post(
    "/",
    protect,
    isAdmin,
    validateCreateService,
    handleValidationErrors,
    createService
);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by service name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of services
 */

router.get("/", getServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *       404:
 *         description: Service not found
 */

router.get("/:id", getServiceById);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
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
 *         description: Service updated
 *       404:
 *         description: Service not found
 */

router.put(
    "/:id",
    protect,
    isAdmin,
    validateUpdateService,
    handleValidationErrors,
    updateService
);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
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
 *         description: Service deleted
 *       404:
 *         description: Service not found
 */

router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteService
);

module.exports = router;