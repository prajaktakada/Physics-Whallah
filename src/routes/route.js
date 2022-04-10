const express = require('express');

const router = express.Router();

const userController=require("../controllers/User_Controller")
 const productController=require("../controllers/Product_Controller")
 const carController = require('../controllers/cartController')
 const orderController = require('../controllers/orderController')
 const Middleware=require("../middleware/Auth")

router.post('/User',userController.createUser)
router.post('/login',userController.login)

 router.post("/product",productController.createproducts)
 router.get('/getProduct',productController.getProduct)
router.post('/users/:userId/cart',Middleware.Auth,carController.createCart)
router.post('/users/:userId/orders',Middleware.Auth,orderController.createOrder)



module.exports = router;