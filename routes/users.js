const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/Users");

// update user
router.put("/:id", async (req, res) => {
    if (req.body.user_id === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has been updated");
        } catch (er) {
            return res.status(500).json(er);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
});

// delete user
router.delete("/:id", async (req, res) => {
    if (req.body.user_id === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully");
        } catch (er) {
            return res.status(500).json(er);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});

// get a user
router.get("/", async (req, res) => {
    const user_id = req.query.user_id;
    const username = req.query.username;
    try {
        const user = user_id
            ? await User.findById(user_id)
            : await User.findOne({ username: username });
        const { password, updatedAt, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// get friends
router.get("/friends/:user_id", async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);
        const friends = await Promise.all(
            user.following.map(friend_id=>{
                return User.findById(friend_id);
            })
        )
        let friendList = [];
        friends.map((friend)=>{
            const {_id, username, profilePicture} = friend;
            friendList.push({_id, username, profilePicture});
        })
        res.status(200).json(friendList);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.user_id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.user_id);
            if (!user.followers.includes(req.body.user_id)) {
                await user.updateOne({ $push: { followers: req.body.user_id } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already following this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
});
// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.user_id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.user_id);
            if (user.followers.includes(req.body.user_id)) {
                await user.updateOne({ $pull: { followers: req.body.user_id } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you already not following this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You cannot unfollow yourself");
    }
});
// update profilePicture of a user
router.put("/:id/profile_pic", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.updateOne({ $set: { profilePicture: req.body.pic } });
    } catch (error) {
        res.status(500).json(error);
    }
});
// update coverPicture of a user
router.put("/:id/cover_pic", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.updateOne({ $set: { coverPicture: req.body.pic } });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/all", async (req, res) => {
    try {
        const name = req.query.name;
        const regex = new RegExp(name, "i");
        const users = await User.find({
            $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
        });
        const usersData = users.map((user) => {
            return {
                username: user.username,
                profilePicture: user.profilePicture,
                email: user.email,
                id: user.id,
            };
        });
        res.json({
            users: usersData,
        });
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;
