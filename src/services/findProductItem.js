const Product = require("../models/productModel");
const mongoose = require('mongoose');
const createError = require("http-errors");


const productFindWithID = async(id, options = {}) =>{
    try{
        const product = await Product.findById(id, options);
        if(!product){ throw createError(404, "Product does not exists")};
        return product;
    } catch(error){
        if(error instanceof mongoose.Error){
            throw createError(400, 'Invalid Product ID')
        };
        throw error;
    }
 }

module.exports = productFindWithID