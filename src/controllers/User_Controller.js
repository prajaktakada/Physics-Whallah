
const userModel = require("../models/user_Model")
const jwt = require("jsonwebtoken")

const createUser = async function (req, res) {
    try {
        const data = req.body
        let saveduser = await userModel.create(data)
        res.status(201).send({ status: true, data: saveduser })
    }
    catch (err) {
        res.status(500).send({ status:false,message: err.message})
    }
}
module.exports.createUser = createUser


const login = async function (req, res) {
    try {
        let useremail = req.body.email
        let userphone = req.body.phone
        if (useremail && userphone) {
            let User = await userModel.findOne({ email: useremail, phone: userphone})

            if (User) {
                const Token = jwt.sign({ userId: User._id }, "secreteKey")
                res.header('x-api-key', Token)
                //console.log(Token)
             
                res.status(200).send({ status: true,User:User._id,Token })
            } else {
                res.status(400).send({ status: false, Msg: "Invalid Credentials" })
            }
        } else {
            res.status(400).send({ status: false, msg: "request body must contain  email as well as phone number" })
        }
    }
    catch (err) {
        res.status(500).send({ status:false,message: err.message})
    }
}


module.exports = {createUser,login}











