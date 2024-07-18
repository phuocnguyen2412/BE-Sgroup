const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
function auth(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
        return res.status(401).send("Access denied");
    }

    try {
        req.user = jwt.verify(token, secret);
        next();
    } catch (err) {
        res.status(400).send(err);
    }
}
module.exports = auth;
