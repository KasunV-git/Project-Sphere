const rateLimit = require("express-rate-limit");

// General API limiter
const apiLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again after 15 minutes."
  }

});

// Login limiter
const loginLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 5,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again after 15 minutes."
  }

});

module.exports = {
  apiLimiter,
  loginLimiter
};