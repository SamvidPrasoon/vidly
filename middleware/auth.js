const dotenv = require('dotenv');
const express = require('express');
dotenv.config({path:'../config/config.env'});
const jwt  = require('jsonwebtoken');

function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token){
       return  res.status(400).json({
            msg:`access denied `
        })

    }
 


       try {
        const decoded =  jwt.verify(token,process.env.JWT_SECRET)
      
        req.user = decoded;
        next();
       } catch (error) {
        res.status(400).json({
            msg:`invalid token `
        })
       }

     
  
}
module.exports = auth;