const express = require("express");
const authorize = require("../middleware/roleMiddleware");
const {protect} = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin"
    });
  }
);

module.exports = router;