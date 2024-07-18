var express = require("express");
var router = express.Router();
var Vote = require("../Models/vote.model");
var auth = require("../middleware/auth.middleware");
// User get vote information
router.get("/:voteId", async function (req, res) {
    const vote = await Poll.findById(req.params.voteId)
        .populate("createdBy", "name email")
        .populate("options.voters", "name email");
    res.status(200).send(vote);
});
// User make a vote
router.post("/", auth, async function (req, res) {
    const { question, description, options } = req.body;
   
    const vote = new Vote({
        question,
        description,
        options: options.map((option) => ({
            title: option.title,
            voters: [],
        })),
        options,
        createdBy: req.user.id,
    });
    await vote.save();
    res.status(201).send(vote);
});
// User lock the vote
router.put("/lock-vote/:voteId/", auth, async function (req, res) {
    const { voteId } = res.params;
    const vote = await Vote.findById(voteId);
    if (vote) {
        vote.isLocked = true;
        vote.save();
        res.status(204).send("Lock the vote successfully");
    } else res.status(400).send("Can't lock the vote !");
});
//User delete the vote
router.delete("/:voteId/", auth, async function (req, res) {
    const { voteId } = res.params;
    const vote = await Vote.findById(voteId);
    if (vote) {
        vote.isDeleted = true;
        vote.save();
        res.status(204).send("Lock the vote successfully");
    } else res.status(400).send("Can't lock the vote !");
});
module.exports = router;
