const { Schema, model } = require("mongoose");
const  paginate  = require("mongoose-paginate-v2");


const schema = new Schema(
  {
    imageUrl : { type: String, required: true },
    title : { type: String, required: true },
    label : { type: String, required: true },
    details : { type: String, required: true },
    nid : { type: String },
    avatar: { type: String }
  },
  { timestamps: true, versionKey: false }
);

schema.plugin(paginate);

schema.methods.toJSON = function () {
  const obj = this.toObject();
  return JSON.parse(JSON.stringify(obj));
};

module.exports = model("blog", schema);