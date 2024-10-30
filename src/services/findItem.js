const User = require("../models/userModel");
const mongoose = require('mongoose');
const createError = require("http-errors");

// find anything by id to be reused
const findWithID = async (Model, id, options = {}) => {
    try {
    const item = await Model.findById(id, options);

    if(!item) {throw createError(404, `${Model.modelName} does not exists`)};
    return item;
        
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400, 'invalid user ID');
          };
          throw error;
    }
}

module.exports = findWithID