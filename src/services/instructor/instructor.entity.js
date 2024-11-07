const instructorSchema = require("./instructor.schema");

module.exports.createInstructor = async (req, res) => {
  try {
    console.log(req);

    const insturctor = await instructorSchema.create(req.body);
    res.status(200).send(insturctor);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports.getAllInsturctor = async (req, res) => {
  try {
    const instructor = await instructorSchema.paginate({

    },{
  
      limit : req.query.limit,
      page : req.query.page
    })

    return res.status(200).send(instructor);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};


module.exports.deleteMultipleInstructorData = async (res, req) => {
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
        message: `${result.deletedCount} Instructor successfully deleted`,
      });
  } catch (error) {
    console.error("Error deleting Instructor Data:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while deleting Instructor data.",
      });
  }
}