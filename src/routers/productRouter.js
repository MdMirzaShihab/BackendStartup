const express = require ('express');
const { getProducts, getProduct, postProduct, putProduct, deleteProduct } = require('../controllers/productController');
const productRouter = express.Router();


// The id is the unique id given from mongodb. So use that id to getProduct(Specific), put & delete
productRouter.get("/", getProducts);
productRouter.get('/:id', getProduct);
productRouter.post('/', postProduct);
productRouter.put('/:id', putProduct);
productRouter.delete('/:id', deleteProduct);

module.exports = productRouter;