const bcrypt  =  require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({path:'../config/config.env'});
const express = require('express');
const User = require('../models/user');
const { check ,validationResult} = require('express-validator');
const jwt  = require('jsonwebtoken');
const router = express.Router();



// all genres
router.post('/',[
   
    check('email').not().isEmpty().withMessage('email is required ').isEmail().withMessage('proper email is required'),
    check('password').not().isEmpty().withMessage("password is required ").isLength({min:6}).withMessage("minimum 6 characters is required")
],async (req,res)=>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }
    try {
           const user = await User.findOne({email:req.body.email})
           if(!user){
               return res.status(400).json({
                   success:false,
                   msg:`invalid email or password`
               })
           }
              
        
           const validpassword=await bcrypt.compare(req.body.password,user.password) 
           console.log(validpassword);     
           if(!validpassword){
        return res.status(400).json({
            success:false,
            msg:`invalid email or password`
        })
      } 

      const token = user.generateAuthToken();



       res.status(200).json({
           success:true,
           token:token
       })




    } catch (error) {
        res.status(400).json({
            success:false,
            msg:`user not registered`
        });
    }
      
});


module.exports = router;