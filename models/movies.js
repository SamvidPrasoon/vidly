const mongoose = require('mongoose');



const MovieSchema = new mongoose.Schema({

      title:{
          type:String,
       
          minlength:5,
          maxlength:30,
       
          trim:true,
          unique:false
      },
    
      numberInStock: { 
        type: Number, 
        required:true,
       
        min: 0,
        max: 255,
        unique:false
      },
      dailyRentalRate: { 
        type: Number, 
        required:true,
        min: 0,
        max: 255,
        unique:false
      },
      genre:{
        type:mongoose.Schema.ObjectId,
        ref:'Genre',
        required:true,
        unique:false
        
      
    
       
 },

  




    });
    module.exports = mongoose.model('Movie',MovieSchema);