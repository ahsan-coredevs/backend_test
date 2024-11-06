const {
  encryptPassword,
  decryptPassword,
} = require("../../utils/passwordFunction");
const jwt= require('jsonwebtoken');
const userSchema = require("./user.schema");
const createAllowed = new Set(["name", "email", "password"]);

module.exports.createUser = async (req, res) => {
  try {
    const isValid = Object.keys(req.body).every((key) =>
      createAllowed.has(key)
    );
    if (!isValid) return res.status(400).send({ message: "Bad request" });

    const isExist = await userSchema.findOne({ email: req.body.email });
    if (isExist)
      return res
        .status(409)
        .send({ message: "User already exist with this email" });

    req.body.password = await encryptPassword(req.body.password);
    const user = await userSchema.create(req.body);
    return res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong."});
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const user = await userSchema.find();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong." });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    //validating body object
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).send({message:'Bad request'});
    

    //finding user with email in database
    let user = await userSchema.findOne({ email });
    if (!user) return res.status(404).send("No user exist with this email");

    //validating password
    const isPasswordValid = await decryptPassword(password, user.password);
    if(!isPasswordValid) res.status(400).send({message:'Wrong password'});
    const token = jwt.sign({_id: user._id.toString(), expTime: new Date(Date.now()+172800000).toISOString()},process.env.COOKIE_SECRET);

    res.status(200).send({data: {user, token}});

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};






module.exports.me = async (req, res) => {
  try {
  return res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};


