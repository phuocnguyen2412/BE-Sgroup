var express = require("express");
var router = express.Router();
var Vote = require("../Models/vote.model");
var auth = require("../middleware/auth.middleware");
// User vote option of vote
router.post("/:voteId/:optionTitle", auth, async (req, res) => {
    try {
        const { voteId, optionTitle } = req.params;

        const poll = await Vote.findById(voteId);

        if (!poll) {
            return res.status(404).send("Poll not found");
        }

        const option = poll.options.find((opt) => opt.title === optionTitle);

        if (!option) {
            return res.status(404).json("Option not found");
        }
        if (poll.isLocked) {
            return res.status(400).json("Poll is locked");
        }
        if (
            option.voters.find((voter) => {
                return voter.toString() === req.user._id;
            })
        ) {
            return res
                .status(400)
                .json("User has already voted for this option");
        }

        option.voters.push(req.user);

        await poll.save();

        res.status(200).json("Vote added");
    } catch (error) {
        res.status(500).json(error);
    }
});
//User delete vote option
router.delete("/:voteId/:optionTitle", auth, async (req, res) => {
    try {
        const { voteId, optionTitle } = req.params;
        const vote = await Vote.findById(voteId);
        if (!vote) {
            res.status(404).send("Vote not found");
        }
        if (vote.createdBy.toString() !== req.user._id) {
            res.status(404).send("Not Allowed");
        }
        const indexNeedToDelete = vote.options.findIndex(
            (opt) => opt.title === optionTitle
        );
        console.log(indexNeedToDelete);
        if (indexNeedToDelete >= 0) {
            vote.options.splice(indexNeedToDelete, 1);
            vote.save();
            res.status(200).send("Delete successfully!");
        } else res.status(404).send("option Not Found");
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
//user cancel vote option
router.put("/:voteId/:optionTitle/cancel", auth, async (req, res) => {
    try {
        const { voteId, optionTitle } = req.params;
        const vote = await Vote.findById(voteId);

        if (!vote) {
            res.status(404).send("Vote not found");
        }
        const option = vote.options.find((opt) => opt.title === optionTitle);

        if (!option) {
            return res.status(404).json("Option not found");
        }
        if (vote.isLocked) {
            return res.status(400).json("Poll is locked");
        }

        const index = option.voters.findIndex(
            (voter) => req.user._id === voter.toString()
        );
        console.log(index);
        if (index < 0) {
            return res.status(400).json("User hasn't voted for this option");
        }
        option.voters.splice(index, 1);
        console.log(option.voters);
        await vote.save();
        res.status(200).send("cancel successfully!");
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;
