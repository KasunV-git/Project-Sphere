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

// User
router.post("/", protect, recordUsage);
router.get("/me", protect, getMyHistory);

// Admin
router.get("/", protect, isAdmin, getAllHistory);
router.delete("/:id", protect, isAdmin, deleteHistory);

module.exports = router;
