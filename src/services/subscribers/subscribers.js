const express = require('express');
const subscribersSchema = require('./subscribers.schema');
const router = express.Router();



router.post('/subscriber', async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).send({ message: "Bad request" });

        const isExist = await subscribersSchema.findOne({email: req.body.email});
        if(isExist) {
            return res.status(409).send({message: 'Email Already Exist for newsLetter.'})
        }
        
        const subscriber = await subscribersSchema.create(req.body);
        return res.status(201).send(subscriber);

    } catch (error) {
        res.status(500).send({message: 'Something Went wrong'})
    }
})

router.get('/subscribers', async (req, res) => {
    try {
        if(!req.query.paginate || !['true','false'].includes(req.query.paginate)) return res.status(400).send('Bad request');

    
        if (req.query.paginate === 'true') {
           const subscribers = await subscribersSchema.paginate({},
                   {
                       limit : req.query.limit || 10,
                       page : req.query.page || 1, 
                   });
                   return res.status(200).send(subscribers);
               }
               else {
                  const subscribers = await subscribersSchema.find();
                  return res.status(200).send(subscribers);
               }
    } catch(error) {
        return  res.status(500).send({message: "Something Went Wrong"});
    }
})


module.exports= router;