const mongoose = require('mongoose');
const ObjectId =  mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    name:{ type: String, required: true},
    email:{ type: String, required: true, unique: true},
    password:{ type: String, required: true},
    followers :[
        {type:ObjectId,ref:"User"} 
    ],
    following:[
        {type:ObjectId,ref:"User"}
    ],
    profilePic:{type:String,default:"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"},
    about:{type:String,default:"About me"},
})

mongoose.model('User',userSchema)