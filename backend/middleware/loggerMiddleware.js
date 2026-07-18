const morgan = require("morgan");
const logger = require("../services/logger");

const stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

const loggerMiddleware = morgan(
  ":method :url :status :response-time ms - :res[content-length] bytes",
  {
    stream
  }
);

module.exports = loggerMiddleware;