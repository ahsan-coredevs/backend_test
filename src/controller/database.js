const { default: mongoose } = require("mongoose");

require("dotenv").config();
async function connectDB(){
    return new Promise(async(resolve, reject)=>{
       try {
        await  mongoose.connect(process.env.MONGODB_URL);
        console.log('=> Database connected')
        resolve()
        
       } catch (error) {

        console.log(error);
        reject(error);
        
        
       }

    })
}

module.exports=connectDB;