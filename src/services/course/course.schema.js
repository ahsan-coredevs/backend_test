const {Schema, model } = require("mongoose");
const  paginate  = require("mongoose-paginate-v2");

const schema = new Schema(
    {
        imageUrl : {type: String, require: true},
        title : {type: String, require: true},
        label : {type:String, require: true},
        price : {type:Number},
        details : {type:String, require: true},
        nid : { type: String },
        avatar: { type: String },
    },
    { timestamps: true, versionKey: false }
);

schema.plugin(paginate);

schema.methods.toJSON = function () {
    const obj = this.toObject();
    return JSON.parse(JSON.stringify(obj));
  };

module.exports = model("Course", schema);
