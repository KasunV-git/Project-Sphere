const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");

const loggerMiddleware = require("./middleware/loggerMiddleware");

const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");

const usageHistoryRoutes = require("./routes/usageHistoryRoutes");

const reviewRoutes = require("./routes/reviewRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const analyticsRoutes = require("./routes/analyticsRoutes");

const {
  apiLimiter,
  loginLimiter,
} = require("./middleware/rateLimitMiddleware");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  compression({
    threshold: 0,
  }),
);

app.use(express.json());

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("Sphere API Running");
});

if (process.env.NODE_ENV !== "test") {
  app.use("/api/auth", loginLimiter, require("./routes/authRoutes"));

  app.use("/api/users", apiLimiter, require("./routes/userRoutes"));

  app.use("/api/services", apiLimiter, require("./routes/serviceRoutes"));

  app.use("/api/categories", apiLimiter, require("./routes/categoryRoutes"));

  app.use("/api/favorites", apiLimiter, require("./routes/favoriteRoutes"));

  app.use("/api/usage", apiLimiter, usageHistoryRoutes);

  app.use("/api/reviews", apiLimiter, reviewRoutes);

  app.use("/api/dashboard", apiLimiter, dashboardRoutes);

  app.use("/api/analytics", apiLimiter, analyticsRoutes);
} else {
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/users", require("./routes/userRoutes"));
  app.use("/api/services", require("./routes/serviceRoutes"));
  app.use("/api/categories", require("./routes/categoryRoutes"));
  app.use("/api/favorites", require("./routes/favoriteRoutes"));
  app.use("/api/usage", usageHistoryRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/analytics", analyticsRoutes);
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

module.exports = app;
