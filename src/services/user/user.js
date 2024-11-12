const express = require('express');
const { createUser, getAllUsers, loginUser, verifyUser, me } = require('./user.entity');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userSchema = require('./user.schema');
const { auth } = require('../middleware');

// Create user
router.post('/user', createUser);
router.post('/user/login', loginUser);

// Get all users
router.get('/user', getAllUsers);
router.get('/me', auth, me); 

router.get('/user/otpsend', async (req, res) => {
  try {
    const { email } = req.query;
    console.log("printemail", email);

    if (!email) return res.status(400).send({ message: 'Bad Request.' });

    // Find the user in the database
    const user = await userSchema.findOne({ email });
    console.log("User details", user);
    if (!user) {
      return res.status(404).send({ exists: false, message: 'No user exists with this email.' });
    }

    // Check if the last OTP request was within the last 5 minutes
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (user.lastOtpRequest && currentTime - user.lastOtpRequest < fiveMinutes) {
      return res.status(429).send({ message: 'Please wait 5 minutes before requesting a new OTP.' });
    }

    // Generate a 4-digit OTP 
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log("4-digit OTP:", otp);

    // Generate a JWT token
    const token = jwt.sign(
      { email: email.toString(), otp: otp, expTime: new Date(Date.now() + 300000).toISOString() },
      process.env.COOKIE_NAME // Ensure this is set correctly
    );
    console.log("Token:", token);

    // Update the lastOtpRequest timestamp in the database
    user.lastOtpRequest = currentTime;
    await user.save();

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '4 Digit OTP Code',
      text: `Your OTP is ${otp}. Please do not share it with anyone.` // Include OTP as text
    };

    // Send the email and wait for the result
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error while sending email:", error);
        return res.status(500).send({ message: 'Error while sending email', error });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).send({ message: 'Email sent successfully', data: { otp, token } });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: 'Something went wrong', error });
  }
});

router.get('/user/verifyotp', async(req,res) => {
    try {
        const {otp, token} = req.query;
        const decryptedData =  jwt.verify(token, process.env.COOKIE_NAME);
        console.log(decryptedData.token);
        if (decryptedData.otp === otp) {
            return res.status(200).send("Verfication Completed");
        } else {
            return res.status(500).send({message: "OTP does not matched"});
        }

    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
})

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






module.exports= router;