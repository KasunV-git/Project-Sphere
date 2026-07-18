const User = require("../models/user");
const Service = require("../models/service");
const Category = require("../models/category");
const Review = require("../models/review");
const Favorite = require("../models/favorite");
const UsageHistory = require("../models/usageHistory");

// Dashboard summary
const getDashboardStats = async (req, res, next) => {
    try {

        const [
            totalUsers,
            totalServices,
            totalCategories,
            totalReviews,
            totalFavorites,
            totalUsage
        ] = await Promise.all([
            User.countDocuments(),
            Service.countDocuments(),
            Category.countDocuments(),
            Review.countDocuments(),
            Favorite.countDocuments(),
            UsageHistory.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalServices,
                totalCategories,
                totalReviews,
                totalFavorites,
                totalUsage
            },
            generatedAt: new Date()
        });

    } catch (error) {

        next(error);

    }
};

module.exports = {
    getDashboardStats
};