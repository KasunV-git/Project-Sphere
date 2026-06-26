const express = require("express");

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  isAdmin,
  getUsers
);

router.get(
  "/:id",
  protect,
  isAdmin,
  getUserById
);

router.put(
  "/:id",
  protect,
  isAdmin,
  updateUser
);

router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteUser
);

module.exports = router;