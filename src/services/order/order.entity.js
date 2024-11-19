
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
    const orders= await orderSchema.paginate({
    },{
      populate:{path:'user course', select:'-password'},
      limit:req.query.limit,
      page:req.query.page
    })
    
    return res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

