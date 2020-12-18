const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path:'../config/config.env'});
const UserSchema = new mongoose.Schema({
   name:{
       type:String,
       required:true
   },
   email:{
       type:String,
       required:true,
       unique:true
   },

   password:{
       type:String,
       required:true,
     
       minlength:6,
     
      
   },
   isadmin:Boolean
  



})
UserSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id,isadmin:this.isadmin},process.env.JWT_SECRET)
    return token;
}
module.exports = mongoose.model('User',UserSchema);