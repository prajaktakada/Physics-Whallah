
const orderModel = require('../models/order_Model')
//POST /users/:userId/orders
const createOrder = async (req, res) => {
    try {
        let requestBody = req.body
        let cartId = req.body.cartId
        let decodedToken = req.user
        let userId = req.params.userId

    
        if (!(decodedToken === userId)) {
            res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
        }
        let findCart = await cartModel.findOne({ _id: cartId })
        console.log(findCart)
        if (!findCart) {
            res.status(400).send({ status: false, message: "cart does not exit" })
        }

        let { items, totalPrice, totalItems } = findCart

        let totalQuantity = 0

        //totalItems= items.length
        for (i = 0; i < items.length; i++) {
            totalQuantity = totalQuantity + items[i].quantity
            console.log(totalQuantity)
        }

        let order = { userId, items, totalPrice, totalItems, totalQuantity }

        const ordercreate = await orderModel.create(order)
        res.status(201).send({ status: true, message: "congrats order successfully placed", data: ordercreate })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}


module.exports = {createOrder}