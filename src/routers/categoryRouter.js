const express = require ('express');
const { getCategories, getCategory, postCategory, putCategory, deleteCategory } = require('../controllers/categoryController');
const categoryRouter = express.Router();


// The id is the unique id given from mongodb. So use that id to getCategory(Specific), put & delete
categoryRouter.get("/", getCategories);
categoryRouter.get('/:id', getCategory);
categoryRouter.post('/', postCategory);
categoryRouter.put('/:id', putCategory);
categoryRouter.delete('/:id', deleteCategory);

module.exports = categoryRouter;