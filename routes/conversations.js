const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.sender_id, req.body.receiver_id],
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get conversation of a user
router.get("/:user_id", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.user_id] },
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get conv includes two users
router.get("/find/:first_user_id/:second_user_id", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.first_user_id, req.params.second_user_id] },
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;
