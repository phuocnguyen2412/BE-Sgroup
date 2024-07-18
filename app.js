var express = require("express");
var app = express();
var router = require("./routes/");
var bodyParser = require("body-parser");
require("dotenv").config();

app.use(express.json());

app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.use("/api/v1", router);

app.listen(1000, function () {
    console.log("Example app listening on port 1000!");
});
