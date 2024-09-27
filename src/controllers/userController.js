const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse,  dataCreatedResponse} = require("./responseController");
const findWithID = require("../services/findItem");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "No users found");

    successResponse(res, {
      statusCode: 200,
      message: " users data returned successfully",
      payload: {
        users,
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


const getUser = async (req, res, next) => {
  try {

    const id = req.params.id;
    const options = {password:0};
    const user = await findWithID(id, options);

    successResponse(res, {
      statusCode: 200,
      message: " user returned successfully",
      payload: {
        user 
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST User
const postUser = async(req, res, next) =>{
  const {name, email, password, image, address, phone, isAdmin, isBanned} = req.body;
  try{
    const newUser = new User({name, email, password, image, address, phone, isAdmin, isBanned});
    await newUser.save();
    dataCreatedResponse(res,{
      statusCode: 201,
      message: "User Created Successfully",
      payload:{
        newUser
      },
    });

  }catch(error){
    next(error);
  }
}

// PUT User


const deleteUser = async (req, res, next) => {
  try {

    const id = req.params.id;
    const options = {password:0};
    const user = await findWithID(id, options);

    successResponse(res, {
      statusCode: 200,
      message: " user deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, postUser, deleteUser };
