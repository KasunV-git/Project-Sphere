const UsageHistory = require("../models/usageHistory");

const getTopServices = async (req, res) => {

    try {

        const topServices = await UsageHistory.aggregate([

            {
                $group: {
                    _id: "$service",
                    totalUses: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    totalUses: -1
                }
            },

            {
                $limit: 10
            }

        ]);

        await UsageHistory.populate(
            topServices,
            {
                path: "_id",
                select: "name slug averageRating reviewCount"
            }
        );

        res.status(200).json({
            success: true,
            topServices
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const Service = require("../models/service");

const getTopRatedServices = async (req, res) => {

    try {

        const services = await Service.find()
            .sort({
                averageRating: -1,
                reviewCount: -1
            })
            .limit(10)
            .populate("category", "name");

        res.status(200).json({
            success: true,
            services
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const Favorite = require("../models/favorite");

const getMostFavoritedServices = async (req, res) => {

    try {

        const favorites = await Favorite.aggregate([

            {
                $group: {
                    _id: "$service",
                    totalFavorites: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    totalFavorites: -1
                }
            },

            {
                $limit: 10
            }

        ]);

        await Favorite.populate(
            favorites,
            {
                path: "_id",
                select: "name slug averageRating reviewCount"
            }
        );

        res.status(200).json({
            success: true,
            favorites
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
  getTopServices,
  getTopRatedServices,
  getMostFavoritedServices
};