var express = require("express");
var router = express.Router();
var Vote = require("../Models/vote.model");
var auth = require("../middleware/auth.middleware");
// User vote option of vote
router.post("/:voteId/option", auth, async (req, res) => {
    const { pollId } = req.params;
    const { optionTitle } = req.body;

    const poll = await Vote.findById(pollId);
    if (!poll) {
        return res.status(404).send("Poll not found");
    }

    const option = poll.options.find((opt) => opt.title === optionTitle);
    if (!option) {
        return res.status(404).send("Option not found");
    }

    if (!option.voters.includes(req.user.id)) {
        option.voters.push(req.user.id);
        await Vote.save();
        return res.status(200).send("Vote added");
    } else {
        return res.status(400).send("User has already voted for this option");
    }
});
//User delete vote option
router.delete("/:voteId/:optionTitle", auth, async (req, res) => {
    const { userId } = req.user;
    const { voteId, optionTitle } = req.params;
    const vote = await Vote.findById(voteId);
    if (!vote) {
        res.status(404).send("Vote not found");
    }
    if (vote.createdBy !== userId) {
        res.status(404).send("Not Allowed");
    }
    const indexNeedToDelete = vote.options.findIndex(
        (opt) => opt.title === optionTitle
    );
    if (index >= 0) {
        vote.options = vote.options.splice(indexNeedToDelete, 1);
        vote.save();
        res.status(200).send("Delete successfully!");
    } else res.status(404).send("option Not Found");
});
//user cancel vote option
router.put("/:voteId/:optionTitle", auth, async (req, res) => {
    const { voteId, optionTitle } = req.params;
    const vote = await Vote.findById(voteId);
    if (!vote) {
        res.status(404).send("Vote not found");
    }
    for (const option of vote.options) {
        if (option.title === optionTitle) {
            const index = option.findIndex(req.user.id);
            option.voters = option.voters.splice(index, 1);
            vote.save();
            res.status(200).send("cancel successfully!");
            break;
        }
    }
    res.status(400).send("Error!");
});
module.exports = router;
