const Post = require("../models/Post");
const User = require("../models/Users");

const router = require("express").Router();

// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});
// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.user_id === req.body.user_id) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("post have been updated");
        } else {
            res.status(403).json("you can update only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
// delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.user_id === req.body.user_id) {
            await post.deleteOne({ $set: req.body });
            res.status(200).json("post have been deleted");
        } else {
            res.status(403).json("you can delete only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
// like/dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.body.user_id)) {
            await post.updateOne({ $pull: { likes: req.body.user_id } });
            res.status(200).json("post has been disliked");
        } else {
            await post.updateOne({ $push: { likes: req.body.user_id } });
            res.status(200).json("post has been liked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
// get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(err);
    }
});
// get timeline posts
router.get("/:id/timeline", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.id);
        const userPosts = await Post.find({ user_id: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ user_id: friendId });
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(err);
    }
});

module.exports = router;
