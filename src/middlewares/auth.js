const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtActivationKey } = require("../secret");

const isLoggedIn = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw createError(401, "Please login first");
    }

    const decoded = jwt.verify(accessToken, jwtActivationKey);

    if (!decoded) {
      throw createError(401, "Please login first");
    }

    req.user = decoded.user;
    next();
  } catch (error) {
    next(error);
  }
};

const isLoggedOut = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, jwtActivationKey);
        if (decoded) {
          throw createError(400, "The user is already logged in");
        }
      } catch (error) {
        throw error;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
