const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const User = mongoose.model('User');
// const {JWT_SECRET} = require('../config/Keys');
const requireLogin = require('../middleware/requireLogin');
const emailvalidator = require("email-validator");


// router.get('/protected',requireLogin,(req,res)=>{
//     res.send('hello')
// })
const JWT_SECRET = 'opbolte'
router.post('/signup',(req,res)=>{
    //  console.log(req.body.name)
    const {name,email,password} = req.body;
    if(!email || !password || !name || !emailvalidator.validate(email)){
        // return res.status(400).send('please enter all the fields');
       return  res.status(422).json({error:'please enter valid email and password'})
    }


        User.findOne({email:email})
        .then((savedUser) => {
            if(savedUser){
               return  res.status(422).json({error:'User already exists'})
            }
            bcrypt.hash(password,12)
            .then(hashedpassword => {
                const user = new User({
                    name,
                    email,password:hashedpassword
                })
    
                user.save().then(user=>{
                    res.json({message:"saved successfully "})
                }).catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{
                console.log(err)
            })
            })
           
})

router.post('/signin',(req,res)=>{
const {email,password}=req.body 
if(!email || !password){
    return res.status(422).json({error:'please provide email or password'})
}
User.findOne({email:email})
.then(savedUser =>{
    if(!savedUser){
     return    res.status(404).json({error:'Invalid email or password'})
    }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch =>{
        if(doMatch){
            // res.json({message:'successfully signed in'})
const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
const {_id,name,email}=savedUser;
res.json({token,user:{_id,name,email}});
        }else{
            return res.status(404).json({error:'Invalid Email or password'})
        }
    })
    .catch(error =>{
        console.log(error)
    })
})
})

module.exports = router