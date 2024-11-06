const jwt= require('jsonwebtoken');
const userSchema = require('./user/user.schema');
module.exports.auth=async(req,res,next)=>{
    try {
       const token= req?.headers?.authorization?.split(' ')[1];
       if(!token)   return res.status(401).send('Unauthorized');
       const decryptedData=  jwt.verify(token,process.env.COOKIE_SECRET);
        const user =await  userSchema.findOne({_id:decryptedData._id});
        if(!user)  return res.status(401).send('Unauthorized');
        if(new Date(decryptedData?.expTime)<new Date())   return res.status(401).send('Unauthorized');
        req.user= user;
        next();
       
        
    } catch (error) {
        console.log(error);
        return res.status(401).send('Unauthorized');
        
    }

}