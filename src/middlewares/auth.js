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

        req.body.userID = decoded._id;
        next();
        
    } catch (error) {
        next(error);
        
    }
}


module.exports = {
    isLoggedIn
}