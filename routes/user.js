const bcrypt  =  require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({path:'../config/config.env'});
const express = require('express');
const User = require('../models/user');
const { check ,validationResult} = require('express-validator');
const jwt  = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/me',auth,async(req,res)=>{
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
        success:true,
        data:user
    })
})
// all genres
router.post('/',[
    check('name').not().isEmpty().withMessage('name is required').isString().withMessage('name should be string'),
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
           if(user){
               return res.status(400).json({
                   success:false,
                   msg:`user already registered`
               })
           }
          
           const salt  = await bcrypt.genSalt(10);
           req.body.password = await bcrypt.hash(req.body.password,salt);  
           const userR = await User.create(req.body);
     
        
           const token = userR.generateAuthToken();
       console.log(token);
      res.header('x-auth-token',token).status(200).json({
          success:true,
          data:[userR.name ,userR.email]
      })




    } catch (error) {
        res.status(400).json({
            success:false,
            msg:`user not registered`
        });
    }
      
});


module.exports = router;