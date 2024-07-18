var express = require("express");
var router = express.Router();

const votes = require("./vote.route");
const options = require("./option.route");
const authRouter = require("./auth.route");

router.use("/vote", votes);
router.use("/option", options);
router.use("/auth", authRouter);

module.exports = router;
