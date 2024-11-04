const {Schema, model } = require("mongoose");

const schema = new Schema(
    {
        name : {type: String, require: true},
        courseName : {type: String, require: true},
        paymentMethod: {type:String, require: true},
        phoneNo : {type: String, require: true},
        taxID : {type: String, require: true},
        nid : { type: String },
        avatar: { type: String },
    },
    { timestamps: true, versionKey: false }
);

schema.methods.toJSON = function () {
    const obj = this.toObject();
    return JSON.parse(JSON.stringify(obj));
  };

module.exports = model("order", schema);