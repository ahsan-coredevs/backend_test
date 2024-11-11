
const express = require('express');
const { createUser, getAllUsers, loginUser, verifyUser, me } = require('./user.entity');
const router = express.Router();

const userSchema = require('./user.schema');
const { auth } = require('../middleware');
//create user
router.post('/user',createUser);
router.post('/user/login', loginUser);


//get all user
router.get('/user',getAllUsers);
router.get('/me',auth,me);


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


router.delete('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');
        const ids = JSON.parse(id);

        const deletedUser = await userSchema.deleteMany({_id:{$in:ids}});

        if (!deletedUser) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send({ message: 'User deleted successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});

// Check if an email exists
router.get('/user/send-otp', async (req, res) => {
    try {
      const { email } = req.query.email;
  
      if (!email) return res.status(400).send({ message: 'Bad Request.' });
  
      const user = await userSchema.findOne({ email });
  
      if (!user) {
        return res.status(404).send({ exists: true, message: 'No User exist with this email.' });
      } 
      //send otp
      const otp = Math.floor(1000 + Math.random() * 9000 );

      const token = jwt.sign({email: email.toString(), otp: otp, expTime: new Date(Date.now()+300000).toISOString()}, process.env.fun);

      res.status(200).send({data : {otp, token}})




    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something went wrong' });
    }
  });
  




module.exports= router;