const rateLimit = require("express-rate-limit");

// General API limiter
const apiLimiter = rateLimit({

  windowMs:
  Number(process.env.RATE_LIMIT_WINDOW_MINUTES) *
  60 *
  1000,

  max: Number(process.env.API_RATE_LIMIT_MAX),

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

  windowMs:
  Number(process.env.RATE_LIMIT_WINDOW_MINUTES) *
  60 *
  1000,

  max: Number(process.env.LOGIN_RATE_LIMIT_MAX),

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