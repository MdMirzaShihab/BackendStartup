const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtActivationKey } = require("../secret");

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        401,
        "Invalid email or password. Please register if you are a new user"
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw createError(
        401,
        "Invalid email or password. Please register if you are a new user"
      );
    }

    if (user.isBanned) {
      throw createError(403, "User is banned, please contact the authority");
    }

    const accessToken = createJSONWebToken(
      { _id: user._id, name: user.name, email: user.email },
      jwtActivationKey,
      "1h"
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60, //15 minutes
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });



    successResponse(res, {
      statusCode: 201,
      message: " user logged in successfully",
      payload: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    // Cleared the access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    successResponse(res, {
      statusCode: 200,
      message: " user logged out successfully",
      payload: {
        user: null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
};
