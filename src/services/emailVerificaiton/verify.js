
const express = require('express');

const verifySchema = require('./verify.schema');
const router = express.Router();

router.get('/user/:id',async(req,res)=>{

    try {
      
        const id= req.params.id;
        if(!id) return res.status(400).send('Bad request');

        const order = await verifySchema.findOne({_id: id});
        res.status(200).send(order)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
   
})