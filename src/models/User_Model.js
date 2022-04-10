const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    fname: {type: String,required: true},
    lname: {type: String,required: true},
    title: {type: String,required: true,enum: ['Mr', 'Mrs', 'Miss']},
    phone: {type: String,required:true,unique: true},
    //alternatePhone: {type: String,required:true,unique: true},
   // OTP: {type:Number,required:true,unique: true},
    email: {type: String,required:true,unique: true},
    address: { 
        shipping: {
        street: { type: String,required: true},
        city: { type: String,required: true},
        pincode: { type:Number,required: true }
       },
      billing: {
      street: { type: String,required: true },
      city: {type: String,required: true },
      pincode: {type:Number,required: true }
      }
     },
    },{ timestamps: true })

module.exports = mongoose.model('user', userSchema)
