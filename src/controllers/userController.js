const createError = require("http-errors");
const fs = require("fs");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const findWithID = require("../services/findItem");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "No users found");

    successResponse(res, {
      statusCode: 200,
      message: " users data returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


const getUserByID = async (req, res, next) => {
  try {

    const id = req.params.id;
    const options = {password:0};
    const user = await findWithID(User, id, options);

    successResponse(res, {
      statusCode: 200,
      message: " user returned successfully",
      payload: {
        user
      },
    });
  } catch (error) {
    next(error);
  }
};


const deleteUserByID = async (req, res, next) => {
  try {

    const id = req.params.id;
    const options = {password:0};
    const user = await findWithID(User, id, options);

    const userImagePath = user.image;
    fs.access(userImagePath, (error) => {
      if (error) {
        console.error("Error accessing user image file:", error);
      }
      else{
        fs.unlink(userImagePath, (error) => {
          if (error) throw error;
          console.log("User image file deleted successfully.");
        });
        }
    }) 
    await User.findByIdAndDelete({_id:id, isAdmin:false});

    successResponse(res, {
      statusCode: 200,
      message: " user deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserByID, deleteUserByID };
