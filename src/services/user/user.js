const express = require('express');
const { createUser, getAllUsers, loginUser, verifyUser, me } = require('./user.entity');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userSchema = require('./user.schema');
const { auth } = require('../middleware');
const bcrypt = require("bcrypt");
const generateOtpTamplate = require('../../utils/templates/optTemplate');

// Create user
router.post('/user', createUser);
router.post('/user/login', loginUser);


router.get('/user', getAllUsers);
router.get('/me', auth, me); 

router.post('/user/otpsend', async (req, res) => {
  try {
    const { email } = req.query;

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
     const otpTamplate = generateOtpTamplate(otp);
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '4 Digit OTP Code',
      html: otpTamplate 
    };

    // Send the email and wait for the result
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ message: 'Error while sending email', error });
      } else {
        return res.status(200).send({ message: 'Email sent successfully', data: { otp, token } });
      }
    });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong', error });
  }
});

router.post('/user/verifyotp', async(req,res) => {
    try {
        const {otp, token} = req.query;
        if (!otp && !token) return res.status(400).send({ message: 'Bad Request.' });

       
        const decryptedData =  jwt.verify(token, process.env.COOKIE_NAME);
        const tokenOtp = decryptedData.otp;
        if (otp.toString() === tokenOtp.toString()) {
            return res.status(200).send({message: "Verification completed"});
        } else {
            return res.status(500).send({message: "Wrong OTP, Try Again"});
        }

    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
})


router.patch("/user/updatepassword", async (req, res) => {
  try {
    const { password, token } = req.body;
  
    const decryptedData = jwt.verify(token, process.env.COOKIE_NAME);
    const email = decryptedData.email;

    // Find the user by email
    const user = await userSchema.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Hash the new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: "Password updated successfully"});
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

//get sigle entity
router.get('/user/:id',async(req,res)=>{
       
    try {
      
        const id= req.params.id;
        if(!id) return res.status(400).send('Bad request');

        const user = await userSchema.findOne({_id: id});
        res.status(200).send(user)
        
    } catch (error) {
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
        res.status(500).send({ message: 'Something went wrong.' });
    }
});






module.exports= router;