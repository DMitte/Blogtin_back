const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: {
        type : String,
        required : true,
        max: 255
    },
    description: {
        type : String,
        required : true,
        max:1048576 //1MB
    },
    tags: {
        type:[String],
        default: []
    },
    author: {
        type:[String],
        required:true,
    },
    datePublic: {
        type: Date,
        default:Date.now()
    },
    imgUrl: {
        type: String,
        required: true
    },
    imgName: {
        type: String,
        required: true,
    }

})

module.exports = mongoose.model('Post', postSchema);