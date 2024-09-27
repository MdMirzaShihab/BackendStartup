const express = require ('express');
const { getUsers, getUser, postUser, deleteUser } = require('../controllers/userController');
const userRouter = express.Router();


// The id is the unique id given from mongodb. So use that id to getUser(Specific), put & delete
userRouter.get("/", getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', postUser);
// userRouter.put('/:id', putUser);
userRouter.delete('/:id', deleteUser);

module.exports = userRouter;