const courseSchema = require("./course.schema");

module.exports.createCourse = async (req, res) => {
  try {
    console.log(req.body);
    const course = await courseSchema.create(req.body);
    res.status(200).send(course);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports.getAllCourse = async (req, res) => {
  try {
    if(!req.query.paginate || !['true','false'].includes(req.query.paginate)) return res.status(400).send('Bad request');

    
   if (req.query.paginate === 'true') {
      const course = await courseSchema.paginate({},
              {
                  limit : req.query.limit || 10,
                  page : req.query.page || 1, 
              });
              return res.status(200).send(course);
          }
          else {
             const course = await courseSchema.find();
             return res.status(200).send(course);
          }
   
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};


module.exports.deleteMultipleItem = async (res, req) => {
    const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid request. IDs array is required.",
      });
  }

  try {
    const result = await Course.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found to delete." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: `${result.deletedCount} courses successfully deleted`,
      });
  } catch (error) {
    console.error("Error deleting courses:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while deleting courses.",
      });
  }
}