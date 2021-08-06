const jwbt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const orig = jwbt.verify(token, "secret" );
        req.userData = orig;
        next(); 
    }catch(error){
        return res.status(401).json({
            message: "You need to login first"
        });
    }

    
}