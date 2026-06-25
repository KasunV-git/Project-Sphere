const express = require("express");

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} = require("../controllers/serviceController");

const {
    validateService,
    handleValidationErrors
} = require("../validation/serviceValidation");

const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    isAdmin,
    validateService,
    handleValidationErrors,
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
    validateService,
    handleValidationErrors,
    updateService
);

router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteService
);

module.exports = router;