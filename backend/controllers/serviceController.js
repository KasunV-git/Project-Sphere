const Service = require("../models/service");
const Category = require("../models/category");

const createService = async (req, res, next) => {
  try {

    const {
      name,
      slug,
      description,
      category,
      icon
    } = req.body;

    // Check whether category exists
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const service = await Service.create({
      name,
      slug,
      description,
      category,
      icon
    });

    res.status(201).json({
      success: true,
      service
    });

  } catch (error) {

      next(error);

  }
};

const getServices = async (req, res, next) => {
  try {

    // -----------------------------
    // Read query parameters
    // -----------------------------

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // -----------------------------
    // Query database
    // -----------------------------

    // -----------------------------
// Build search filter
// -----------------------------

const filter = {};

// Search by name
if (req.query.search) {
  filter.name = {
    $regex: req.query.search,
    $options: "i"
  };
}

// Filter by category ID
if (req.query.category) {
  filter.category = req.query.category;
}

// Filter by active status
if (req.query.isActive !== undefined) {
  filter.isActive = req.query.isActive === "true";
}

// -----------------------------
// Query database
// -----------------------------

// -----------------------------
// Sorting
// -----------------------------

const sort = req.query.sort || "-createdAt";

const services = await Service.find(filter)
  .populate("category")
  .sort(sort)
  .skip(skip)
  .limit(limit);

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,

      total,

      currentPage: page,

      totalPages: Math.ceil(total / limit),

      count: services.length,

      services
    });

  } catch (error) {

      next(error);

  }
};

const getServiceById = async (req, res, next) => {
  try {

    const service = await Service.findById(req.params.id)
    .populate("category");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      service
    });

  } catch (error) {

   next(error);

}
};

const updateService = async (req, res, next) => {
  try {

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      service
    });

  } catch (error) {

      next(error);

  }

};

const deleteService = async (req, res, next) => {
  try {

    const service = await Service.findByIdAndDelete(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted"
    });

  } catch (error) {

      next(error);

  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
};