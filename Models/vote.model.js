var db = require("../configs/mongodb");
const { OptionSchema } = require("./option.model");

var Vote = db.model("Vote", {
    question: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    options: [OptionSchema],
    isLocked: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: db.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});
module.exports = Vote;
