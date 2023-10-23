const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const admin = require('firebase-admin')


router.get('/all', async(req,res) =>{
    try{
        const users = await User.find()
        res.status(200).json({
            message: 'Users list',
            data: {users}
            
        })
    }catch(err){
        res.status(400).json({
            message: err
        })
    }
})

router.get('/one', async (req,res) =>{

    try{
        const user = await User.findById(req.query.id)
        
        res.status(200).json({            
            message:'User found!',
            data: user,
        })

    }catch(err){
        res.status(400).json({
            message: err
        })
    }

})
router.get('/my', async (req,res) =>{

    let token = req.header('auth-token');
    const decoded = jwt.decode(token)
    
    try{
        const user = await User.findById(decoded._id)


        res.status(200).json({            
            message:'User found!',
            data: user,
                      
        })

    }catch(err){
        res.status(400).json({
            message: err
        })
    }
})
router.put('/edit', async(req,res) =>{

    //recover token
    let token = req.header("auth-token");
    let decoded = jwt.decode(token)
    
    try{
        await User.findOneAndUpdate({_id: decoded._id}, req.body)
        res.status(200).json({
            message:"user updated"
        })
    }catch(err){
        res.status(400).json({
            err
        })
    }
})

router.delete('/delete', async(req,res) =>{
    //recover token
    let token = req.header("auth-token");
    let decoded = jwt.decode(token)

    try{
        await User.findOneAndDelete({_id: decoded._id})
        res.status(200).json({
            message: "User deleted!"
        })

    }catch(err){
        res.status(400).json({
            err
        })
    }
})

module.exports = router;
