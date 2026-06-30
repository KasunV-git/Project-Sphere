const UsageHistory = require("../models/usageHistory");
const Service = require("../models/service");
const Favorite = require("../models/favorite");

const getTopServices = async (req, res, next) => {

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

        next(error);

    }

};


const getTopRatedServices = async (req, res, next) => {

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

        next(error);

    }

};


const getMostFavoritedServices = async (req, res, next) => {

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

        next(error);

    }

};

const getUsageTrends = async (req, res, next) => {

    try {

        const trends = await UsageHistory.aggregate([

            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    totalUsage: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]);

        res.status(200).json({
            success: true,
            trends
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
  getTopServices,
  getTopRatedServices,
  getMostFavoritedServices,
  getUsageTrends
};