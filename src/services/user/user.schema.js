const { Schema, model } = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    nid: { type: String },
    avatar: { type: String },
  },
  { timestamps: true, versionKey: false }
);

schema.plugin(paginate);

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return JSON.parse(JSON.stringify(obj));
};

module.exports = model("User", schema);
