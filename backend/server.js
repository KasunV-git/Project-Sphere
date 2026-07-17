require("dotenv").config();

const app = require("./app");

const logger = require("./services/logger");

const PORT = process.env.PORT || 5000;

const NODE_ENV =
  process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  logger.info(
    `Server running on port ${PORT} (${NODE_ENV})`
  );
});