const Favorite = require("../models/favorite");
const Service = require("../models/service");

// Add favorite
const addFavorite = async (req, res, next) => {
  try {

    const { service } = req.body;

    const existingService = await Service.findById(service);

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      service
    });

    res.status(201).json({
      success: true,
      favorite
    });

  } catch (error) {

    if (err.code === 11000) {

      statusCode = 400;

        if (err.keyPattern?.user && err.keyPattern?.service) {
          err.message = "Already in favorites";
        } else {
          err.message = "Duplicate resource";
        }

    }

    next(error);

  }
};

// Get my favorites
const getMyFavorites = async (req, res, next) => {
  try {

    const favorites = await Favorite.find({
      user: req.user.id
    }).populate("service");

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites
    });

  } catch (error) {

    next(error);

  }
};

// Remove favorite
const removeFavorite = async (req, res, next) => {
  try {

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      service: req.params.serviceId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Favorite removed"
    });

  } catch (error) {

    next(error);

  }
};

module.exports = {
  addFavorite,
  getMyFavorites,
  removeFavorite
};