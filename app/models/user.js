const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required : true,
        min: 2,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        minLenght: 6,
    },
    name: {
        type: String,
        required: false,
        max: 255,
    },
    lastname: {
        type:String ,
        required:false,
        max: 255
    },
    imgUrl: {
        type: String,
        required: true,  
    },
    imgName: {
        type: String,
        required: false,
        min: 6,
    },
    birthday: {
        type: Date,
        min: 6
    },
    username: {
        type: String,
        required: false,
    },
    codeReset: {
        type: Number,
        required: false,
        min: 1,
        max: 8,
        default: 1
    }
    
})

module.exports = mongoose.model('User', userSchema);