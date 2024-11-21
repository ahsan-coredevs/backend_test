const {Schema, model } = require("mongoose");
const  paginate  = require("mongoose-paginate-v2");

const schema = new Schema(
    {
        email: { type: String, required: true }
    },
    { timestamps: true, versionKey: false }
);
schema.plugin(paginate);

schema.methods.toJSON = function () {
    const obj = this.toObject();
    return JSON.parse(JSON.stringify(obj));
  };

module.exports = model("subscribes", schema);