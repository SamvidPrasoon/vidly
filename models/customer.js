const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({


name:{
    type:String,
    required:true,
    unique:true,
    minlength:5,
    maxlength:20
},
isGold:{
   type:Boolean,
   default:false

},
phone:{
    type:String,
    required:true,
    max:10
}







});


module.exports  = mongoose.model('Customer',CustomerSchema);