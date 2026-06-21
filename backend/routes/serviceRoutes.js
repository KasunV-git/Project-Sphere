const express = require("express");

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} = require("../controllers/serviceController");

const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  isAdmin,
  createService
);

router.get(
  "/",
  getServices
);

router.get("/:id", getServiceById);

router.put(
  "/:id",
  protect,
  isAdmin,
  updateService
);

router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteService
);

module.exports = router;