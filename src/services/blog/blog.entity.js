const blogSchema = require('./blog.schema');


module.exports.createBlog=async(req,res)=>{
    try {
        console.log(req.body);

        const blog = await blogSchema.create(req.body);
        res.status(201).send(blog)
        
    } catch (error) { 
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }

}


module.exports.getAllBlogs = async(req,res)=>{
    try {
        const blog= await blogSchema.paginate({
          
        },{
          
          limit:req.query.limit,
          page:req.query.page
         
        })
    
        return res.status(200).send(blog);

    } catch (error) {
        console.log(error)
        res.status(500).send({message:'Something went wrong.'})
        
    }
    

}