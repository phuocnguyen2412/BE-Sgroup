var express = require("express");
var app = express();
var router = require("./src/routes/index");
var bodyParser = require("body-parser");
require("dotenv").config();

app.use(express.json());

app.get("/", function (req, res) {
    res.send("Hello World anh Khánh ");
});

app.use("/api/v1", router);

app.listen(3000, function () {
    console.log("Example app listening on port 3000!");
});
