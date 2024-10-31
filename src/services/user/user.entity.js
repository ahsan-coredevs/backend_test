const userSchema = require('./user.schema');


module.exports.createUser=async(req,res)=>{
    try {
        console.log(req.body);

        const user = await userSchema.create(req.body);
        res.status(201).send(user)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
    

}


module.exports.getAllUsers=async(req,res)=>{
    try {

        const user = await userSchema.find();
        res.status(200).send(user)
       
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
    

}