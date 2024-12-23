const {Schema, model } = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const schema = new Schema(
    {
        photo : {type: String},
        name : {type: String, require: true},
        designation : {type:String, require: true},
        details : {type:String, require: true},
        skill : [{type:String}],
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

module.exports = model("Instructor", schema);