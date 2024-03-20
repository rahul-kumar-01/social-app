import Post from '../models/post-schema.js';
import User from '../models/user-schema.js';
import { errorHandler } from '../utils/errorHandler.js';
import Feed from '../models/feed-schema.js';

export const createPost = async (req, res, next) => {
    try{
        if(req.params.id  !== req.user.id) errorHandler(401, 'Unauthorized');
        const post = new Post({
            user: req.user._id,
            content: req.body.content
        });
        const user = await User.findById(req.user.id);
        user.posts.unshift(post._id);
        const feed = await Feed.create({ user: req.user._id, post: post._id });
        user.followers.forEach(async (follower) => {
            const followerUser = await User.findById(follower);
            followerUser.feeds.unshift(feed._id);
            await followerUser.save();
        });
        await user.save();
        await post.save();
        return res.status(201).json({success:true,post});
    }catch(err){
        console.log(err);
        next(err);
    }
}

export const deletePost = async (req, res,next) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) errorHandler(404, 'Post not found');
        if(post.user.toString() !== req.user.id) errorHandler(401, 'Unauthorized');
        const feedRelatedToPost = await Feed.findOneAndDelete({post: req.params.id});
        if(!feedRelatedToPost) errorHandler(404, 'Feed not found');
        const allUsers = await User.find({});
        allUsers.forEach(async (user) => {
            user.feeds = user.feeds.filter((feed) => feed.toString() !== feedRelatedToPost._id.toString());
            await user.save();
        });
        const user = await User.findById(req.user.id);
        user.posts = user.posts.filter((postId) => postId.toString() !== req.params.id);
        await user.save();


        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({success:true,post});
    }catch(err){
        next(err);
    }
}


export const viewPost = async (req, res,next) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) errorHandler(404, 'Post not found');
        const postUser = await User.findById(post.user);
        if(!postUser) errorHandler(404, 'Post is invalid');
        const userIsFollowing = postUser.followers.includes(req.user.id) || postUser._id.toString() === req.user.id;
        if(userIsFollowing) res.status(200).json({success:true,post});
        else errorHandler(401, 'Unauthorized');
    }
    catch(err){
        next(err);
    }
}

export const getPost = async (req, res,next) => {
    try{
        if(req.user.id !== req.params.id) errorHandler(401, 'Unauthorized');
        const user = await User.findById(req.params.id).populate('posts').sort({createdAt: 1});
        if(!user) errorHandler(404, 'User not found');
        return res.status(200).json({success:true,data: user.posts});
    }
    catch(err){
        next(err);
    }
}

