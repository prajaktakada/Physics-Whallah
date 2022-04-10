const productModel= require("../models/Product_Model")
const aws = require("aws-sdk");
const  upload=require('../controllers/AWS')


//POST /products
const createproducts = async function (req, res) {
  try {
      let data=req.body
      let files= req.files;
         // console.log(files)
      if(files && files.length > 0){
        var uploadedFileURL = await upload.uploadFile(files[0]);
      }else{
          res.status(400).send({status:false,message:"please provide image "})
      }
        
      var {title,description,price,currencyId,currencyFormat,availableSizes,installments} = req.body

      let availSiz = JSON.parse(availableSizes)

      const istitleAlreadyUsed = await productModel.findOne({title});
      if (istitleAlreadyUsed) {
          return res.status(400).send({ status: false, message: `${title} title is already registered` })
      }
      currencyId = currencyId.toUpperCase().trim()
      
      if (currencyId !== 'INR') {
          res.status(400).send({ status: false, message: 'provide valid INR currencyId' })
          return

      }
      if (currencyFormat !== '₹') {
          res.status(400).send({ status: false, message: 'provide valid currencyFormat' })
          return
      }

      const userDetails= {title,description,price,currencyId,currencyFormat,productImage:uploadedFileURL,availableSizes:availSiz,installments}
      let saveduser = await productModel.create(userDetails);
      res.status(201).send({ status: true, message: "product created successfully", data: saveduser });

} catch(err) {
      console.log(err)
      res.status(500).send({ status: false, msg:err.message })
  }
}




//GET /products
const getProduct = async function(req,res){
    try{

        if(req.query.size || req.query.name || req.query.priceGreaterThan || req.query.priceLessThan ){
            let availableSizes = req.query.size
            let title = req.query.name
            let priceGreaterThan = req.query.priceGreaterThan
            let priceLessThan = req.query.priceLessThan
            obj = {}
            if(availableSizes){
                obj.availableSizes = availableSizes.toUpperCase()
            }
       
            if(title){
                obj.title = {  $regex: '.*' + title.toLowerCase() + '.*' }
            }
            if(priceGreaterThan){
                obj.price = { $gt: priceGreaterThan}
            }
            if(priceLessThan){
                obj.price = { $lt: priceLessThan}
            }
            obj.isDeleted = false
            obj.deletedAt = null

            console.log(obj)
            const getProductsList = await productModel.find(obj).sort({price : 1})
            // console.log(getProductsList)
            if(!getProductsList || getProductsList.length == 0){
                res.status(400).send({status: false, message: `product is not available right now.`})
            }else{
                res.status(200).send({status: true, message:'Success', data: getProductsList})
            }
        }else{
            const getListOfProducts = await productModel.find({isDeleted:false, deletedAt: null}).sort({price:1})
            res.status(200).send({status: true, message:'Success', data: getListOfProducts })
        }
    }catch(err){
        res.status(500).send({status: false, msg : err.message})
    }

}

module.exports = {createproducts,getProduct}





