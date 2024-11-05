const {Schema, model } = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const schema = new Schema(
    {
        user: {type: Schema.Types.ObjectId, ref:"User"},
        course: {type: Schema.Types.ObjectId, ref:"Course"},
        paymentMethod: {type:String, require: true},
        phoneNo : {type: String, require: true},
        taxID : {type: String, require: true},
    },
    { timestamps: true, versionKey: false }
);

schema.plugin(paginate);

schema.methods.toJSON = function () {
    const obj = this.toObject();
    return JSON.parse(JSON.stringify(obj));
  };

module.exports = model("order", schema);