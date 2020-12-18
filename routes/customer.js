const express = require('express');
const Customer = require('../models/customer');
const { check ,validationResult} = require('express-validator');
const rentalRouter = require('./rental');
const router = express.Router();
router.use('/:movieId/rental',rentalRouter);

// all customers
router.get('/',async (req,res)=>
{
       try {
           const customers = await Customer.find();
           if(!customers )
           {
               res.status(201).json({
                   success:true,
                   msg:'no customers found'
               })
           }
           res.status(201).json({
               success:true,
               data:customers
           })
       } catch (error) {
           res.status(400).json({
               success:false,
               
           });
       }
});



// one customer
router.get('/:id',async (req,res)=>
{
       try {
           const customer = await Customer.findById(req.params.id);
           
           if(!customer){
            return   res.status(400).json({success:false,
                msg:`customer not found with id ${req.params.id}`});
        } 


           res.status(201).json({
               success:true,
               data:customer
           })
       } catch (error) {
           res.status(400).json({
               success:false,
               msg:`customer not found with id ${req.params.id}`
               
           });
       }
});





//create customer
router.post('/',[
    check('name').not().isEmpty().withMessage('name is required').isString().withMessage('name should be string ').isLength({max :10}).withMessage('name should not be more than 10characters'),
    check('phone').not().isEmpty().withMessage('phone no. is required ').isNumeric().withMessage('phone no. should be numerical values').isLength({min:10}).withMessage('phone no. should be of min 10 numbers')

],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }
    try {
        const customer  = await Customer.create(req.body);
        res.status(201).json({success:true,
    
        data:customer

        
        });
    } catch (error) {
        res.status(400).json({success:false,
            msg:`customer not created  `
        })
    }
     


});




//update customer

router.put('/:id',[
    check('name').not().isEmpty().withMessage('name is required').isString().withMessage('name should be string ').isLength({max :10}).withMessage('name should not be more than 10characters'),
    check('phone').not().isEmpty().withMessage('phone no. is required ').isNumeric().withMessage('phone no. should be numerical values').isLength({min:10}).withMessage('phone no. should be of min 10 numbers')
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!customer){
           
           return   res.status(400).json({success:false,msg:`no customer with id${req.params.id}`});

       } 
    
       res.status(200).json({
           success:true,
           msg:`customer updated successfully`,
           data:customer
       });
    } catch (error) {
        
        res.status(400).json({success:false});
    }


});


// delete genre
router.delete('/:id',async (req,res)=>{
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
          
        
        if(!customer){
           return   res.status(400).json({success:false});
       } 
       res.status(200).json({
           success:true,
           msg:`customer deleted successfully`,
           data:{}
       });
    } catch (error) {
        res.status(400).json({success:false});
    }
});



module.exports = router;