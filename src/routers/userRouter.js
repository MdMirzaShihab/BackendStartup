const express = require ('express');
const { getUsers, getUserByID, deleteUserByID, processRegister, activateUserAccount } = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const userRouter = express.Router();



userRouter.get("/", getUsers);
userRouter.get('/:id', getUserByID);
userRouter.delete('/:id', deleteUserByID);
userRouter.post("/process-register", upload.single('image'), processRegister);
userRouter.post("/verify", activateUserAccount);

module.exports = userRouter;