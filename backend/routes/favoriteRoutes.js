const express = require("express");

const router = express.Router();

const {
  addFavorite
} = require("../controllers/favoriteController");

const {
  protect
} = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  addFavorite
);

module.exports = router;