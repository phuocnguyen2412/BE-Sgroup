var db = require("mongoose");
require("dotenv").config();
const stringUrl = process.env.MONGODB_URL;
console.log(stringUrl);
try {
    db.connect(stringUrl);
} catch (error) {
    console.log(error);
}

module.exports = db;
