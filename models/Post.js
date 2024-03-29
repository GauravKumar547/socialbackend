const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            max: 500,
        },
        img: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
        },
        comments: {
            type: Array,
            default: [],
        },
        shares: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", PostSchema);
