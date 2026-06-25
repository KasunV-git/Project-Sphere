const { body, validationResult } = require("express-validator");

const validateCreateService = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Service name is required"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .isMongoId()
    .withMessage("Invalid category id")

];

const validateUpdateService = [

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Service name cannot be empty"),

  body("slug")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Slug cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id")

];

const handleValidationErrors = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({
      success: false,
      errors: errors.array()
    });

  }

  next();

};

module.exports = {
  validateCreateService,
  validateUpdateService,
  handleValidationErrors
};