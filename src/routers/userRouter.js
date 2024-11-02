const express = require ('express');
const { getUsers, getUserByID, deleteUserByID, processRegister, activateUserAccount, updateUserByID } = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const { runValidation } = require('../validators');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const userRouter = express.Router();



userRouter.get("/", isLoggedIn, getUsers);
userRouter.get('/:id', isLoggedIn, getUserByID);
userRouter.delete('/:id', isLoggedIn, deleteUserByID);
userRouter.put('/:id', isLoggedIn, upload.single('image'), updateUserByID);
userRouter.post("/process-register", isLoggedOut, upload.single('image'), validateUserRegistration, runValidation, processRegister);
userRouter.post("/activate", isLoggedOut, activateUserAccount);

module.exports = userRouter;