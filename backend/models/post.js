const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;
const postschema = new Schema({
    
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{
         type:ObjectId,
        ref:"signin"
    }],
    comments:[{
        comment:{type:String},
        postedby:{
            type:ObjectId,
            ref:"signin"
        }

    }],
    postedby:{
        type:ObjectId,
        ref:"signin"
    }
},{timestamps:true})
const post = mongoose.model('post', postschema);
module.exports=post;

