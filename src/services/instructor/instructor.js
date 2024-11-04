
const express = require('express');
const router = express.Router();

const instructorSchema = require('./instructor.schema');
const { createInstructor, getAllInsturctor } = require('./instructor.entity');


//create course
router.post('/instructor',createInstructor);

//get all courses
router.get('/instructor',getAllInsturctor);



//get sigle entity
router.get('/instructor/:id',async(req,res)=>{

    try {
      
        const id= req.params.id;
        if(!id) return res.status(400).send('Bad request');

        const instructor = await instructorSchema.findOne({_id: id});
        res.status(200).send(instructor)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
    
   
})



//update sigle entity
router.patch('/instructor/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');

        const updatedInstructorData = await instr.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated
            runValidators: true // Run schema validations
        });

        if (!updatedInstructorData) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send(updatedInstructorData);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});


//delete sigle entity
router.delete('/instructor/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Instructor id", id);
        if (!id) return res.status(400).send('Bad request');
        const ids= JSON.parse(id);
  
        const deletedInstructorData = await instructorSchema.deleteMany({_id: {$in: ids}});

        if (!deletedInstructorData) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send({ message: 'Instructor Data deleted successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});






module.exports= router;