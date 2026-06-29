const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const usageHistoryRoutes = require("./routes/usageHistoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

connectDB();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Sphere API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/services", require("./routes/serviceRoutes"));

app.use("/api/categories", require("./routes/categoryRoutes"));

app.use("/api/favorites", require("./routes/favoriteRoutes"));

app.use("/api/usage", usageHistoryRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/analytics", analyticsRoutes);

const errorHandler =
require("./middleware/errorMiddleware");

app.use(errorHandler);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);