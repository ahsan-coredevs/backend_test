require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./controller/database");
const PORT = process.env.PORT || 4000;
const userSchema = require('./services/user/user.schema')

const app = express();

app.use(cors());
app.use(express.json());



app.get('/health', async(req, res)=>{
    res.status(200).send('Yo Yo!');
});

//apies starts


//create user
app.post('/user',async(req,res)=>{

    try {
        console.log(req.body);

        const user = await userSchema.create(req.body);
        res.status(201).send(user)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
    
   
});

//get all user
app.get('/user',async(req,res)=>{

    try {
      

        const user = await userSchema.find();
        res.status(200).send(user)
        res.status(200).json(product);
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
     
});


//get single user
app.get('/user/:id',async(req,res)=>{

    try {
      
        const id= req.params.id;
        if(!id) return res.status(400).send('Bad request');

        const user = await userSchema.findOne({_id: id});
        res.status(200).send(user)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
    
   
})



//update
app.put('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');

        const updatedUser = await userSchema.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validations
        });

        if (!updatedUser) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});


//delete
app.delete('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');

        const deletedUser = await userSchema.findByIdAndDelete(id);

        if (!deletedUser) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send({ message: 'User deleted successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});





//spien ends

async function start(){
    try {
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`=> Server is listening on http://127.0.0.1:${PORT}`)
        })
        
    } catch (error) {
        console.log(error)
        
    }

}


start();

