const express = require ('express');
const { getUsers, getUserByID, deleteUserByID, processRegister, activateUserAccount, updateUserByID } = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const { runValidation } = require('../validators');
const userRouter = express.Router();



userRouter.get("/", getUsers);
userRouter.get('/:id', getUserByID);
userRouter.delete('/:id', deleteUserByID);
userRouter.put('/:id', updateUserByID);
userRouter.post("/process-register" ,upload.single('image'), processRegister);
userRouter.post("/verify", activateUserAccount);

module.exports = userRouter;