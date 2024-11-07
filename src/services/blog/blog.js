
const express = require('express');
const router = express.Router();

const blogSchema = require('./blog.schema');
const { createBlog, getAllBlogs } = require('./blog.entity');

//create blog
router.post('/blog',createBlog);

//get all blogs
router.get('/blog',getAllBlogs);


router.get('/blog/:id',async(req,res)=>{

    try {
      
        const id= req.params.id;
        if(!id) return res.status(400).send('Bad request');

        const blog = await blogSchema.findOne({_id: id});
        res.status(200).send(blog)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
    
   
})



//update sigle entity
router.put('/blog/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');

        const updatedBlog = await blogSchema.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validations
        });

        if (!updatedBlog) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send(updatedBlog);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});


router.delete('/blog/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).send('Bad request');
        const ids= JSON.parse(id);
  

 
       

        const deleteblog = await blogSchema.deleteMany({_id: {$in: ids}});

        if (!deleteblog) return res.status(404).send({ message: 'User not found.' });

        res.status(200).send({ message: 'blog deleted successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong.' });
    }
});



module.exports= router;






module.exports= router;