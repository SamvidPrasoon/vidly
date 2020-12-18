const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});

//db section
const connectdb = require('./config/db');

const app = express();

app.use(express.json());


//routes

const genre = require('./routes/genre');
const customer = require('./routes/customer');
const movie = require('./routes/movies');
const rental = require('./routes/rental');
const user = require('./routes/user');
const auth =require('./routes/auth');
app.use('/api/genre',genre);
app.use('/api/customer',customer);
app.use('/api/movie',movie);
app.use('/api/rental',rental);
app.use('/api/user',user);
app.use('/api/auth',auth);







// server section


const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, console.log('server running on port 5000'));
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
   server.close(() => process.exit(1));
});
