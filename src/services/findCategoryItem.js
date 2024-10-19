const Category = require("../models/categoryModel");
const mongoose = require('mongoose');
const createError = require("http-errors");


const categoryFindWithID = async(id, options = {}) =>{
    try{
        const category = await Category.findById(id, options);
        if(!category){ throw createError(404, "Category does not exists")};
        return category;
    } catch(error){
        if(error instanceof mongoose.Error){
            throw createError(400, 'Invalid Category ID')
        };
        throw error;
    }
 }

module.exports = categoryFindWithID