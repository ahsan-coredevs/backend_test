
const express = require('express');
const { createUser, getAllUsers } = require('./user.entity');
const router = express.Router();

const userSchema = require('./user.schema');
//create user
router.post('/user',createUser);

//get all user
router.get('/user',getAllUsers);


//get sigle entity
router.get('/user/:id',async(req,res)=>{

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



//update sigle entity
router.put('/user/:id', async (req, res) => {
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


//delete sigle entity
router.delete('/user/:id', async (req, res) => {
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






module.exports= router;