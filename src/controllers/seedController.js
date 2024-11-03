const data = require("../data");
const User = require("../models/userModel");


//seed users function that will delete all existing data and insert new users from the data file
const seedUser = async (req, res, next) => {
  try {
    //delete all existing data
    await User.deleteMany({});

    //insert new users
    const users = await User.insertMany(data.users);

    //success response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser };
