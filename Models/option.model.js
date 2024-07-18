var db = require("../configs/mongodb");
var OptionSchema = db.Schema({
    title: {
        type: String,
        require: true,
    },
    voters: [{ type: db.Schema.Types.ObjectId, ref: "User" }],
});
var Option = db.model("Option", OptionSchema);
module.exports = {
    Option,
    OptionSchema,
};
