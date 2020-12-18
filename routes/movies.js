
const express = require('express');

const Movie = require('../models/movies');
const Genre = require('../models/genre');
const rentalRouter = require('./rental');
const { check ,validationResult} = require('express-validator');
const router = express.Router({mergeParams:true});
router.use('/:movieId/rental',rentalRouter);

// all movies
router.get('/',async (req,res)=>
{
       try {
          let query;
          if(req.params.genreId){
              query = Movie.find({genre:req.params.genreId});
          }else{
              query = Movie.find();
          }
          const movie = await query;
           res.status(201).json({
               success:true,
               data:movie
           })
       } catch (error) {
           res.status(400).json({
               success:false,
               
           });
       }
});



// one movie
router.get('/:id',async (req,res)=>
{
       try {
           const movie = await Movie.findById(req.params.id).populate({
               path:'genre',
               select:'name'
           });
           
           if(!movie){
            return   res.status(400).json({success:false,
                msg:`movie not found with id ${req.params.id}`});
        } 


           res.status(201).json({
               success:true,
               data:movie
           })
       } catch (error) {
           res.status(400).json({
               success:false,
               msg:`movie not found with id ${req.params.id}`
               
           });
       }
});





//create movie
router.post('/',async (req,res)=>{
    try {
        req.body.genre = req.params.genreId;
        const genre = await Genre.findById(req.params.genreId);
         if(!genre){
             res.status(400).json({
                 success:false,
                 msg:`id not found`
             });
         }
          const movie= await Movie.create(req.body);
   
     
    

    
       
       
  
            res.status(200).json({
                success:true,
                data:movie
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
       
          const movie= await Movie.findByIdAndUpdate(req.params.id,req.body,{
              new:true,
              runValidators:true
          }).populate({
              path:'genre',
              select:'name'
          });
   
          if(!movie){
              res.status(400).json({
                  success:true,
                  msg:`movie not found with id ${req.params.id}`
              })
          }
         

    
       
       
  
            res.status(200).json({
                success:true,
                data:movie
            });
    } catch (error) {
           res.status(400).json({
               success:false,
               msg:`not updated`
           });           
    }
})


// delete genre
router.delete('/:id',async (req,res)=>{
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
          
        
        if(!movie){
           return   res.status(400).json({success:false});
       } 
       res.status(200).json({
           success:true,
           msg:`movie deleted successfully`,
           data:{}
       });
    } catch (error) {
        res.status(400).json({success:false});
    }
});



module.exports = router;