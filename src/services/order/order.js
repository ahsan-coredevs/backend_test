
const express = require('express');
const { createOrder, getAllOrder } = require('./order.entity');
const orderSchema = require('./order.schema');
const router = express.Router();




//create course
router.post('/order',createOrder);

//get all courses
router.get('/order',getAllOrder);



//get sigle entity
router.get('/order/:id',async(req,res)=>{

    try {
      
        const id= req.params.id;
        if(!id) return res.status(400).send('Bad request');

        const order = await orderSchema.findOne({_id: id});
        res.status(200).send(order)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
   
})

//update sigle entity
router.patch('/order/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');

        const updatedOrderData = await instr.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated
            runValidators: true // Run schema validations
        });

        if (!updatedOrderData) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send(updatedOrderData);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});


//delete sigle entity
router.delete('/insturctor/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');
        const ids= JSON.parse(id);
  
        const deletedOrderData = await orderSchema.deleteMany({_id: {$in: ids}});

        if (!deletedOrderData) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send({ message: 'Order Data deleted successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});






module.exports= router;