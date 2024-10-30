const createError = require("http-errors");
const fs = require("fs").promises;
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const findWithID = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { clientURL, jwtActivationKey } = require("../secret");
const { emailWithNodeMailer } = require("../helper/email");
const jwt = require("jsonwebtoken");
const { MAX_FILE_SIZE } = require("../config");


// get all users
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


// get user by id
const getUserByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithID(User, id, options);

    successResponse(res, {
      statusCode: 200,
      message: " user returned successfully",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// delete user by id
const deleteUserByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithID(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    successResponse(res, {
      statusCode: 200,
      message: " user deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// update user by id
const updateUserByID = async (req, res, next) => {
  try {
    const updateId = req.params.id;
    const options = { password: 0 };
    await findWithID(User, updateId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};
    for (let key in req.body) {
      if (["name", "phone", "address", "password"].includes(key)) {
        updates[key] = req.body[key];
      }
    }
    const image = req.file;
    if (image) {
      if (image.size > MAX_FILE_SIZE) {
        throw createError(400, "User image should be less than 2MB");
      }
      updates.image = image.buffer.toString("base64");
    }
    const updatedUser = await User.findByIdAndUpdate(
      updateId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "user not found");
    }

    successResponse(res, {
      statusCode: 200,
      message: " user profile updated successfully",
      payload: {
        updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// register user upto sending email
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const image = req.file;

    if (!image) {
      throw createError(400, "User image is required");
    }

    if (image.size > MAX_FILE_SIZE) {
      throw createError(400, "User image should be less than 2MB");
    }

    const imageBufferString = req.file.buffer.toString("base64");

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, "user already exists, please login");
    }

    const token = createJSONWebToken(
      { name, email, password, phone, address, image: imageBufferString },
      jwtActivationKey,
      "1h"
    );

    const emailData = {
      email,
      subject: "Activate your account",
      text: `please click here to activate your account: ${token}`,
      html: `<h2> Hello ${name}, </h2> <p> please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank"> activate your account </a> </p>`,
    };

    try {
      await emailWithNodeMailer(emailData);
    } catch (error) {
      next(createError(500, `failed to send varification email to ${email}`));
      return;
    }

    successResponse(res, {
      statusCode: 200,
      message: `Please check your email: ${email} to activate your account within 1 hour`,
      payload: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// activate user account by token
const activateUserAccount = async (req, res, next) => {
  try {
    const { token } = req.body.token;
    if (!token) {
      throw createError(404, "token not found");
    }

    const decoded = jwt.verify(token, jwtActivationKey);

    if (!decoded) {
      throw createError(401, "the user is not authorized to activate account");
    }

    const userExists = await User.exists({ email: decoded.email });
    if (userExists) {
      throw createError(409, "user already exists, please login");
    }

    await User.create(decoded);

    successResponse(res, {
      statusCode: 201,
      message: `User has been registered successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserByID,
  deleteUserByID,
  updateUserByID,
  processRegister,
  activateUserAccount,
};
