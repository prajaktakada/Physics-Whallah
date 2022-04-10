
const jwt = require("jsonwebtoken")

const Auth = async function (req, res, next) {
    try {

        let token = req.headers['x-api-key']
        if (!token) {
            res.status(400).send({ status: false, Message: 'Mandatory authentication token is missing.' })
        } else {
            let decodedtoken = jwt.verify(token, "secreteKey")
            if (decodedtoken) {
                req.user = decodedtoken
                // console.log(decodedtoken)
                next()
            }
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.Auth = Auth










// const jwt = require("jsonwebtoken")

// const Auth = async function (req, res, next) {
//     try {

//         const token = req.header('x-api-key')
//             if(!token) {
//                 return res.status(403).send({status: false, message: `Missing authentication token in request`})  
//             }
    
//             let decoded = jwt.verify(token, "Group4")

//             if(!decoded) {
//                 return res.status(400).send({status: false, message: `Invalid authentication token in request`})    
//             }

//             req.authorId = decoded.authorId;

//             next()
//         } catch (error) {
//             //console.error(`Error! ${error.message}`)
//             return res.status(500).send({status: false, message: error.message})
//         }
//     }
    

        
// module.exports.Auth = Auth