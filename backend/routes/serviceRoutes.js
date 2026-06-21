const express = require("express");

const {
  createService,
  getServices
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

module.exports = router;