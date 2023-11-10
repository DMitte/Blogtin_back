const router = require('express').Router();
const Post = require('../models/post')
const User = require('../models/user')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const admin  = require('firebase-admin')


//validations
const postSchema = Joi.object({
    titulo: Joi.string().max(255).required(),
    desciption: Joi.string().max(1048576).required(),
    tags: Joi.array(),
    author: Joi.array().required(),
    imgName: Joi.string().required()

})



router.get('/all', async (req,res) =>{
    try{
        const posts = await Post.find()
        res.status(200).json({
            message:'posts list',
            data :  { posts }
        })


    }catch(err){
        res.status(400).json({
            message: err
        })
    }
})
router.get('/one', async (req,res) =>{
    try{
        const post = await Post.findOne({_id: req.query.id})

        res.status(200).json({
            message:"Post found",
            data:{post}
        })
    }catch(err){
        res.status(400).json({
            message:err
        })
    }
})
router.post('/new', async (req,res) =>{


    //validate schema
    const {err} = postSchema.validate(req.body);
    if(err) return res.status(400).json({message : err.details[0].message});

    //obteniendo dato header
    let token = req.header('auth-token');
    const decoded = jwt.decode(token)    

    //get url img
    const bucket = admin.storage().bucket();
    const filename = req.body.imgName
    const file = bucket.file(filename);
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2100'
    })

    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags || [],
        author: decoded._id,
        imgUrl: url,
        imgName: req.body.imgName

    })

    try{
        await post.save();
        res.status(200).json({
            message:"Post created successfully",
        })

    }catch(err){
        res.status(400).json({
            message: err
        })
    }

})
router.put('/edit', async (req,res) =>{


    //recover token 
    let token = req.header("auth-token");
    let decoded = jwt.decode(token)
    
    try{
        await Post.findOneAndUpdate({_id: req.query.id}, req.body)
        res.status(200).json({
            message: 'Edited correctly'
        })

    }catch(err){
        res.status(400).json({
            err
        })
    }

})

router.delete('/delete', async (req,res) =>{
    //let token = req.header('auth-token')

    try{
      await Post.findOneAndDelete({_id: req.query.id}, req.body)  
      res.status(200).json({
        message:'Deleted Successfully!'
      })
    }catch(err){
        res.status(200).json({
            err
        })
    }
})

router.get('/one/user', async(req,res) =>{
    try{
        const user = await User.findById(req.query.id)
        res.status(200).json({
            message: 'User found!',
            data: user
        })
    }catch(err){
        res.status(400).json({
            message: err
        })
    }
})
    

module.exports = router;