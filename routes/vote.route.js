var express = require("express");
var router = express.Router();
var Vote = require("../Models/vote.model");
var auth = require("../middleware/auth.middleware");
// User get vote information
router.get("/:voteId", async function (req, res) {
    const vote = await Vote.findById(req.params.voteId)
        .populate("createdBy", "name email")
        .populate("options.voters", "name email");
    res.status(200).send(vote);
});
// User make a vote
router.post("/", auth, async function (req, res) {
    try {
        console.log(req.user);
        const { question, description, options } = req.body;

        const vote = new Vote({
            question,
            description,
            options: options.map((option) => ({
                title: option.title,
                voters: [],
            })),
            isDeleted: false,
            createdBy: req.user,
        });
        await vote.save();
        res.status(201).send(vote);
    } catch (error) {
        res.status(400).json(error);
    }
});
// User lock the vote
router.put("/lock-vote/:voteId/", auth, async function (req, res) {
    try {
        const { voteId, isLocked } = req.params;

        const vote = await Vote.findById(voteId);

        if (vote) {
            if (req.user._id !== vote.createdBy.toString())
                res.status(401).send("Bạn không phải là người vote");
            vote.isLocked = isLocked;
            vote.save();
            res.status(204).json("Lock the vote successfully");
        } else res.status(400).send("Can't lock the vote !");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
//User delete the vote
router.delete("/:voteId/", auth, async function (req, res) {
    try {
        const { voteId } = req.params;

        const vote = await Vote.findById(voteId);
        if (vote) {
            if (req.user._id !== vote.createdBy.toString())
                res.status(401).json("Unanthorization");
            vote.isDeleted = true;
            vote.save();
            res.status(204).send("Lock the vote successfully");
        } else res.status(400).send("Can't lock the vote !");
    } catch (error) {
        res.status(400).json(error);
    }
});
module.exports = router;
