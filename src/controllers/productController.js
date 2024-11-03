const createError = require("http-errors");
const { errorResponse, successResponse, dataCreatedResponse} = require("./responseController");
const productFindWithID = require("../services/findProductItem");
const Product = require("../models/productModel");


// GET ALL Products
const getProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { title: { $regex: searchRegExp } }
      ],
    };

    const options = { password: 0 };

    const products = await Product.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await Product.find(filter).countDocuments();

    if (!products) throw createError(404, "No products found");

    successResponse(res, {
      statusCode: 200,
      message: "Product data returned successfully",
      payload: {
        products,
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


// GET Specific Product by ID
const getProduct = async (req, res, next) => {
  try {

    const id = req.params.id;
    const options = {password:0};
    const product = await productFindWithID(id, options);

    successResponse(res, {
      statusCode: 200,
      message: "Product returned successfully",
      payload: {
        product 
      },
    });
  } catch (error) {
    next(error);
  }
};



// POST Product
const postProduct = async(req, res, next) =>{
  
  const {title, description, pricePerUnit, availableUnits, minimumOrder, maximumOrder, isSold, isBanned} = req.body;
  try{
    const newProduct = new Product({title, description, pricePerUnit, availableUnits, minimumOrder, maximumOrder, isSold, isBanned});
    await newProduct.save();
    dataCreatedResponse(res,{
      statusCode: 201,
      message: "Product Created Successfully",
      payload:{
        newProduct
      },
    });

  }catch(error){
    next(error);
  }
}

// PUT Product
const putProduct = async(req, res, next) =>{
  const updatedData = req.body;
  const id = req.params.id;
  const options = {password:0};
  try{
    // Here findByIdAndUpdate is from node js. 
    const productById = await Product.findByIdAndUpdate(id, updatedData, {new: true, runValidators: true}); 
    await productFindWithID(productById, options); 
    return successResponse(res, {
      statusCode: 200,
      message: "Product updated successfully",
      payload: {
        productById 
      },
    });
  } catch (error) {
    next(error);
  }
}


// DELETE Product
const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = {password:0};
    const productById = await productFindWithID(id, options); // From findItem.js 
    
    await Product.findByIdAndDelete(productById);
    successResponse(res, {
      statusCode: 200,
      message: "Product deleted successfully",
      payload: {
        productById 
      },
    });
  } catch (error) {
    next(error);
  }
};




// Taken from productRouter.js
module.exports = { getProducts, getProduct, postProduct, putProduct, deleteProduct };