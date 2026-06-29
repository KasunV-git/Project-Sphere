const helmet = require("helmet");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const usageHistoryRoutes = require("./routes/usageHistoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const {
  apiLimiter,
  loginLimiter
} = require("./middleware/rateLimitMiddleware");

const app = express();

connectDB();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

app.use(express.json());



app.get("/", (req, res) => {
  res.send("Sphere API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(
  "/api/auth",
  loginLimiter,
  require("./routes/authRoutes")
);

app.use(
  "/api/users",
  apiLimiter,
  require("./routes/userRoutes")
);

app.use(
  "/api/services",
  apiLimiter,
  require("./routes/serviceRoutes")
);

app.use(
  "/api/categories",
  apiLimiter,
  require("./routes/categoryRoutes")
);

app.use(
  "/api/favorites",
  apiLimiter,
  require("./routes/favoriteRoutes")
);

app.use(
  "/api/usage",
  apiLimiter,
  usageHistoryRoutes
);

app.use(
  "/api/reviews",
  apiLimiter,
  reviewRoutes
);

app.use(
  "/api/dashboard",
  apiLimiter,
  dashboardRoutes
);

app.use(
  "/api/analytics",
  apiLimiter,
  analyticsRoutes
);

const errorHandler =
require("./middleware/errorMiddleware");

app.use(errorHandler);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);