const User = require("../models/userModel");
const mongoose = require('mongoose');
const createError = require("http-errors");

const findWithID = async (id, options = {}) => {
    try {
    const item = await User.findById(id, options);

    if(!item) {throw createError(404, "User does not exists")};
    return item;
        
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400, 'Invalid user ID');
          };
          throw error;
    }
}

module.exports = findWithID