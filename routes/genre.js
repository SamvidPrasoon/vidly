const express = require('express');
const Genre = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { check ,validationResult} = require('express-validator');
const movieRouter  = require('./movies');
const router = express.Router();

router.use('/:genreId/movie',movieRouter);

// all genres
router.get('/',async (req,res)=>
{
       try {
           const genres = await Genre.find();
           if(!genres )
           {
               res.status(201).json({
                   success:true,
                   msg:'no genres found'
               })
           }
           res.status(201).json({
               success:true,
               data:genres
           })
       } catch (error) {
           res.status(400).json({
               success:false,
               
           });
       }
});



// one genre
router.get('/:id',async (req,res)=>
{
       try {
           const genre = await Genre.findById(req.params.id);
           
           if(!genre){
            return   res.status(400).json({success:false,
                msg:`bootcamp not found with id ${req.params.id}`});
        } 


           res.status(201).json({
               success:true,
               data:genre
           })
       } catch (error) {
           res.status(400).json({
               success:false,
               msg:`bootcamp not found with id ${req.params.id}`
               
           });
       }
});





//create genre
router.post('/',[
   check('name','name is required').isString().not().isEmpty()

],auth,async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }
    try {
        const genre  = await Genre.create(req.body);
        res.status(201).json({success:true,
        msg: `genre created`
        
        });
    } catch (error) {
        res.status(400).json({success:false,
            msg:`genre not created or duplicate genre `
        })
    }
     


});




//update bootcamp

router.put('/:id',[
    check('name','name is required').not().isEmpty().isString()
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!genre){
           
           return   res.status(400).json({success:false});

       } 
    
       res.status(200).json({
           success:true,
           data:genre
       });
    } catch (error) {
        
        res.status(400).json({success:false});
    }


});


// delete genre
router.delete('/:id',[auth,admin],async (req,res)=>{
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
          
        
        if(!genre){
           return   res.status(400).json({success:false});
       } 
       res.status(200).json({
           success:true,
           data:{}
       });
    } catch (error) {
        res.status(400).json({success:false});
    }
});




























module.exports = router;