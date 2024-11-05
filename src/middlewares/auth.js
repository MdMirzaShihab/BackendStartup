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

    req.user = decoded;

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

const isAdmin = (req, res, next) => {
    try {
        console.log('req.user');
        const admin = req.user.isAdmin;
        if (!admin) {
            throw createError(403, "Forbidden!, admin access only");
        }
        console.log(admin);

        next();


    } catch (error) {
      next(error);
    }
  };

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdmin
};
