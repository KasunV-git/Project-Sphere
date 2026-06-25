const Favorite = require("../models/favorite");
const Service = require("../models/service");

const addFavorite = async (req, res) => {
  try {

    const { service } = req.body;

    const existingService =
      await Service.findById(service);

    if (!existingService) {

      return res.status(404).json({
        success: false,
        message: "Service not found"
      });

    }

    const favorite =
      await Favorite.create({
        user: req.user.id,
        service
      });

    res.status(201).json({
      success: true,
      favorite
    });

  } catch (error) {

    if (error.code === 11000) {

      return res.status(400).json({
        success: false,
        message: "Already in favorites"
      });

    }

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  addFavorite
};