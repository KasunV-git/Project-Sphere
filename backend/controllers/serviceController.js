const Service = require("../models/service");

const createService = async (req, res) => {
  try {

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      service
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getServices = async (req, res) => {
  try {

    const services = await Service.find();

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  createService,
  getServices
};