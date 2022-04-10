
const cartModel= require("../models/Cart_Madel")
//const userModel= require("../models/User_Model")
let productModel = require('../models/Product_Model')


const createCart = async (req, res) => {
    try{
    let requestbody = req.body
    const cartId = req.body.cartId;
    const UserId = req.params.userId
    TokenDetail = req.user

    if (!(TokenDetail == UserId)) {
        res.status(401).send({ status: false, message: "userId in url param and in token is not same" })
    }
   
if(!(requestbody.items[0].quantity>=1)){
    return res.status(400).send({status:false,msg:'provide quentity greter than 1'})
}


    let findCart = await cartModel.findOne({ userId: UserId });
    if (findCart) {
        const { items } = requestbody;
        for (let i = 0; i < items.length; i++) {
            const product = await productModel.findOne({ _id: (items[i].productId) })
            console.log(product)

            let ProductIndex = findCart.items.findIndex(p => p.productId == items[i].productId)
            if (ProductIndex > -1) {
                findCart.items[ProductIndex].quantity = findCart.items[ProductIndex].quantity + items[i].quantity;
                await findCart.save();
                findCart.totalPrice = findCart.totalPrice + ((items[i].quantity) * (product.price))
                await findCart.save();
                return res.status(200).send({ status: true, data: findCart })

            } else {

                TotalPrice = findCart.totalPrice + ((items[i].quantity) * (product.price))
                TotalItems = findCart.totalItems + 1;
                const cartdetail = await cartModel.findOneAndUpdate({ userId: findCart.userId }, { $addToSet: { items: { $each: items } }, totalPrice: TotalPrice, totalItems: TotalItems }, { new: true })

                return res.status(200).send({ status: true, data: cartdetail })
            }

        }

    }
    if (!findCart) {
        const { items } = requestbody;
        for (let i = 0; i < items.length; i++) {
            const product = await productModel.findOne({ _id: (items[i].productId) })
            let price = product.price;
            let total = (items[i].quantity) * price;
            let TotalItems = 1
            const newCart = {
                userId: UserId,
                items: [{ productId: items[i].productId, quantity: items[i].quantity }],
                totalPrice: total,
                totalItems: TotalItems
            }
            const data = await cartModel.create(newCart);
            return res.status(201).send({ status: true, data: data })
        }
    }
}catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
}
}

module.exports = {createCart}
