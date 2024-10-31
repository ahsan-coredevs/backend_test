
const express = require('express');
const router = express.Router();


const { createCourse, getAllCourse, deleteMultipleItem } = require('./course.entity');
const courseSchema = require('./course.schema');


//create course
router.post('/course',createCourse);

//get all courses
router.get('/course',getAllCourse);

//delete multiple course



//get sigle entity
router.get('/course/:id',async(req,res)=>{

    try {
      
        const id= req.params.id;
        if(!id) return res.status(400).send('Bad request');

        const course = await courseSchema.findOne({_id: id});
        res.status(200).send(course)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
    
   
})



//update sigle entity
router.patch('/course/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');

        const updatedCourse = await courseSchema.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated
            runValidators: true // Run schema validations
        });

        if (!updatedCourse) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send(updatedCourse);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});


//delete sigle entity
router.delete('/course/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');
        const ids= JSON.parse(id);
  

 
       

        const deletedcourse = await courseSchema.deleteMany({_id: {$in: ids}});

        if (!deletedcourse) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send({ message: 'course deleted successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});






module.exports= router;