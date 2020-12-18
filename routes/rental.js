const express = require('express');
const Rental= require('../models/rental');

const Movie = require('../models/movies');
const Customer = require('../models/customer');

const { check ,validationResult} = require('express-validator');
const { Mongoose } = require('mongoose');
const router = express.Router({mergeParams:true});

//all rentals
router.get('/',async (req,res)=>
{
       try {
          let query;
          if(req.params.movieId){
              query = Rental.find({movie:req.params.movieId});
          }else if(req.params.customerId){
              query =Rental.find({customer:req.params.customerId});
          }
          else{
              query = Rental.find();
          }
          const rental = await query;
           res.status(201).json({
               success:true,
               data:rental
           })
       } catch (error) {
           res.status(400).json({
               success:false,
               
           });
       }
});

//one rental

router.get('/:id',async (req,res)=>
{
       try {
           const rental = await Rental.findById(req.params.id).populate(
               [
                   {
                   path:'movie',
                   select:'title'
                } ,
               {
                   path:'customer',
                   select:'name',
                }
              ]);
           
           if(!rental){
            return   res.status(400).json({success:false,
                msg:`rental not found with id ${req.params.id}`});
        } 


           res.status(201).json({
               success:true,
               data:rental
           })
       } catch (error) {
           res.status(400).json({
               success:false,
               msg:`rental not found with id ${req.params.id}`
               
           });
       }
});


//create rental
router.post('/:movieId/:customerId',async (req,res)=>{
    try {
        req.body.movie = req.params.movieId;
        req.body.customer = req.params.customerId;
        const movie = await Movie.findById(req.params.movieId)
     
         if(!movie){
             res.status(400).json({
                 success:false,
                 msg:`id not found`
             });
         }
         const customer = await Customer.findById(req.params.customerId);
         if(!customer){
             res.status(400).json({
                 success:false,
                 msg:`id not found`
             });
         }
          const rental= await Rental.create(req.body)
          movie.numberInStock--;
          movie.save();
    
            res.status(200).json({
                success:true,
                data:rental
            });

    } catch (error) {
           res.status(400).json({
               success:false,
               msg:`not created`
           });           
    }
})


//update  movie

router.put('/:id',async (req,res)=>{
    try {
       
          const rental= await Rental.findByIdAndUpdate(req.params.id,req.body,{
              new:true,
              runValidators:true
          })
   
          if(!rental){
              res.status(400).json({
                  success:true,
                  msg:`rental not found with id ${req.params.id}`
              })
          }
         

    
       
       
  
            res.status(200).json({
                success:true,
                data:rental
            });
    } catch (error) {
           res.status(400).json({
               success:false,
               msg:`not updated`
           });           
    }
})


// delete rental
router.delete('/:id',async (req,res)=>{
    try {
        const rental = await Rental.findByIdAndDelete(req.params.id);
      
        
        if(!rental){
           return   res.status(400).json({success:false});
       } 
       res.status(200).json({
           success:true,
           msg:`rental deleted successfully`,
           data:{}
       });
       const movie = await Movie.findById(rental.movie);
       movie.numberInStock++;
       movie.save();
    } catch (error) {
        res.status(400).json({success:false});
    }
});




module.exports = router;