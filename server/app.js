const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

//const session=require('express-session');
dotenv.config({ path: './config.env' });

require('./db/conn');

// const videoCall = require("./routes/videoIndex");

app.use(cors())
app.use(express.json());



const PORT = process.env.PORT;

//link router file to make the link
app.use(require('./routes/auth'));


//Middleware

// const middleware = (req,res,next) => {
//     console.log('Hi Middleware'); 
//     next();
// }


// app.get('/',(req,res)=>{
//     res.send('Hello from the other side');
// });

app.get('/login', (req, res) => {
    res.send('Hello from the login');
});



// app.get('/newproject',(req,res)=>{
//     console.log('hi new proj');
//     res.send('Hello from the newproject');
// });

app.listen(5000, () => {
    console.log(`running server at ${PORT}`);
});