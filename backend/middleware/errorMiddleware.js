const logger = require("../services/logger");

const errorHandler = (err, req, res, next) => {

  logger.error(err);

  let statusCode = res.statusCode;

  if (statusCode === 200) {
    statusCode = 500;
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {

    statusCode = 400;

    err.message = "Invalid resource ID";

  }

  // Duplicate key
  if (err.code === 11000) {

    statusCode = 400;

    err.message = "Duplicate resource";

  }

  // Validation Error
  if (err.name === "ValidationError") {

    statusCode = 400;

    err.message = Object.values(err.errors)
      .map(item => item.message)
      .join(", ");

  }

  res.status(statusCode).json({

    success: false,

    message:
      err.message || "Internal Server Error"

  });

};

module.exports = errorHandler;