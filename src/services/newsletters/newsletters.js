const express = require('express');
const newslettersSchema = require('./newsletters.schema');
const { sendNewsLetterToSubscribers } = require('./newsletter.functon');
const createAllowed= new Set(['text']);

const router = express.Router();



router.post('/newsletter', async(req, res) => {
    try {
        const isValid = Object.keys(req.body).every(key=>createAllowed.has(key));
        if(!isValid) return res.status(400).send({message:'Bad request'});

        const newsLetter = await newslettersSchema.create(req.body);
        sendNewsLetterToSubscribers(newsLetter.text);
        return res.status(201).send(newsLetter);

    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Something Went wrong'})
    }
})

router.get('/newsletters', async(req, res) => {
    try {
        if(!req.query.paginate || !['true','false'].includes(req.query.paginate)) return res.status(400).send('Bad request');

    
        if (req.query.paginate === 'true') {
           const newsletters = await newslettersSchema.paginate({},
                   {
                       limit : req.query.limit || 10,
                       page : req.query.page || 1, 
                   });
                   return res.status(200).send(newsletters);
               }
               else {
                  const newsletters = await newslettersSchema.find();
                  return res.status(200).send(newsletters);
               }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
})

router.delete('/newsLetter/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');
        const ids= JSON.parse(id);
  
        const newsLetteruser = await newslettersSchema.deleteMany({_id: {$in: ids}});

        if (!newsLetteruser) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send({ message: 'newsLetter deleted successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});



module.exports= router;

