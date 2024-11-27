const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 6000;
// const {MONGOURI} = require('./config/Keys');
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL,{ 
    useNewUrlParser: true
})

mongoose.connection.on('connected',()=>{
    console.log('connected to mongo instance');
})
mongoose.connection.on('error',(err)=>{
    console.log('error to mongo instance',err);
})



require('./models/user') // user schema
require('./models/post') // post schema

app.use(cors());
app.use(express.json()); // Middleware to parse to json

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(require('./routes/auth'))//resister rpoutes
app.use(require('./routes/post'))
app.use(require('./routes/user'))


// For production
// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static('client/build'))
//     const path = require('path')
//     app.get('*',(req,res) =>{
//         res.sendFile(path.resolve(__dirname,'client','build','index.html'))
//     })
// }

app.get('/',(req,res)=>{
res.send('welcome to Gosocial')
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});