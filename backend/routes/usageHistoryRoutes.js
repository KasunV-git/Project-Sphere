const express = require("express");

const {
  recordUsage
} = require("../controllers/usageHistoryController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  recordUsage
);

module.exports = router;
