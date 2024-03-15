import mongoose from "mongoose";

const feedSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    seen : {
        type: Boolean,
        required: true,
        default: false
    },
    // user who write the post
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps: true
});

const Feed = mongoose.model('Feed', feedSchema);
export default Feed;