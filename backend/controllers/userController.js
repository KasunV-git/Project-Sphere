const User = require("../models/user");

const getUsers = async (req, res, next) => {
  try {

    const users = await User.find().select("-password").lean();

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {

    next(error);

  }
};

/* ---------------------------------------- */
const getUserById = async (req, res, next) => {

  try {

    const user = await User.findById(req.params.id)
      .select("-password").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    next(error);

  }

};

/* ---------------------------------------- */
const updateUser = async (req, res, next) => {

  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    next(error);

  }

};

/* ---------------------------------------- */
const deleteUser = async (req, res, next) => {

  try {

    const user = await User.findByIdAndDelete(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted"
    });

  } catch (error) {

    next(error);

  }

};

/* ---------------------------------------- */
module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};