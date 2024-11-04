const {Schema, model } = require("mongoose");

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

schema.methods.toJSON = function () {
    const obj = this.toObject();
    return JSON.parse(JSON.stringify(obj));
  };

module.exports = model("course", schema);
