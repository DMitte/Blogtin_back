const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const admin = require('firebase-admin')

//validation
const schemaRegister = Joi.object({
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    repeat_password: Joi.ref('password'),
    name: Joi.string().max(255),
    lastname: Joi.string().max(255),
    img: Joi.string().min(6),
    birthday: Joi.date(),
    username: Joi.string().min(3).max(30),
})

const schemaLogin = Joi.object({
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

router.post('/register', async (req,res) =>{

    //validate schema
    const {err} = schemaRegister.validate(req.body);
    if(err) return res.status(400).json({message : err.details[0].message});


    //email  exist
    const isEmailExist = await User.findOne({email: req.body.email})
    if(isEmailExist) return res.status(400).json({message:'this Email already exists'})

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //get image path
    const bucket = admin.storage().bucket();
    const filename = req.body.imgName
    const file= bucket.file(filename)
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2100',
    })

    const user = new User({
        email: req.body.email,
        password:password,
        name: req.body.name || '',
        lastname: req.body.lastname ||'',
        imgUrl: url,
        imgName: req.body.imgName,
        birthday: req.body.birthday ,
        username: req.body.username||'',
    })
    try{
        await user.save();
        res.status(200).json({
            message: "User created successfully",                
        })
    }catch(error){
        res.status(400).json({            
            message: error,            
        })
    }

})

router.post('/login', async (req, res) =>{
    //validate schema
    const {err} = schemaLogin.validate(req.body);
    if(err) return res.status(400).json({message : err.details[0].message});

    const user = await User.findOne({email: req.body.email});
    if(!user)return res.status(400).json({message: "Invalid Credentials"});

    //compare passwords
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword ) return res.status(400).json({message:"Wrong Password"})

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET,{expiresIn: '1d'})

    res.header('auth-token' , token ).status(200).json({
        "success": true,
        "token": token,
    })
})

router.post('/forgot-password', async(req, res) =>{
    

})
module.exports = router;