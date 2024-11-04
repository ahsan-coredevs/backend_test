const orderSchema = require("./order.schema");


module.exports.createOrder = async (req, res) => {
  try {
    console.log(req.body);

    const order = await orderSchema.create(req.body);
    res.status(200).send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports.getAllOrder = async (req, res) => {
  try {
    const order = await orderSchema.find();
    res.status(200).send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};


module.exports.deleteMultipleOrderData = async (res, req) => {
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
    const result = await order.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No order found to delete." });
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