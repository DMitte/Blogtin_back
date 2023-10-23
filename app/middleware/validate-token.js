const jwt = require('jsonwebtoken');

//protected routes
const verifyToken = (req,res,next) =>{
    let token = req.header('auth-token');
    if(!token) return res.status(400).json({message: 'No auth provided'})

    try{
        jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
            if(err){
                res.status(400).json({
                    message:'Invalid Token'
                })
            }else{
                next();
            }
        });        
        
    }catch(err){
        res.status(400).json({message : err})
    }
}

module.exports = verifyToken
