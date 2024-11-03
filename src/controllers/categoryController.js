const createError = require("http-errors");
const { errorResponse, successResponse, dataCreatedResponse} = require("./responseController");
const categoryFindWithID = require("../services/findCategoryItem");
const Category = require("../models/categoryModel");


// GET ALL Products
const getCategories = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } }
      ],
    };

    const options = { password: 0 };

    const categories = await Category.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await Category.find(filter).countDocuments();

    if (!categories) throw createError(404, "No categories found");

    successResponse(res, {
      statusCode: 200,
      message: "Category data returned successfully",
      payload: {
        categories,
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


// GET Specific Category by ID
const getCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = {password:0};
    const category = await categoryFindWithID(id, options);

    successResponse(res, {
      statusCode: 200,
      message: "Category returned successfully",
      payload: {
        category 
      },
    });
  } catch (error) {
    next(error);
  }
};



// POST Category
const postCategory = async(req, res, next) =>{
  
  const {name, isBanned} = req.body;
  try{
    const newCategory = new Category({name, isBanned});
    await newCategory.save();
    dataCreatedResponse(res,{
      statusCode: 201,
      message: "Category Created Successfully",
      payload:{
        newCategory
      },
    });

  }catch(error){
    next(error);
  }
}

// PUT Category
const putCategory = async(req, res, next) =>{
  const updatedData = req.body;
  const id = req.params.id;
  const options = {password:0};
  try{
    // Here findByIdAndUpdate is from node js. 
    const categoryById = await Category.findByIdAndUpdate(id, updatedData, {new: true, runValidators: true}); 
    await categoryFindWithID(categoryById, options); 
    return successResponse(res, {
      statusCode: 200,
      message: "Category updated successfully",
      payload: {
        categoryById 
      },
    });
  } catch (error) {
    next(error);
  }
}


// DELETE Category
const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = {password:0};
    const categoryById = await categoryFindWithID(id, options); // From findItem.js 
    
    await Category.findByIdAndDelete(categoryById);
    successResponse(res, {
      statusCode: 200,
      message: "Category deleted successfully",
      payload: {
        categoryById 
      },
    });
  } catch (error) {
    next(error);
  }
};




// Taken from productRouter.js
module.exports = { getCategories, getCategory, postCategory, putCategory, deleteCategory };