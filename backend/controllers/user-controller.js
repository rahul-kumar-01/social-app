import User from '../models/user-schema.js';
import {errorHandler} from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Feed from '../models/feed-schema.js';

export const createUser = async (req, res, next) => {
    try{
        const { uuid,name, password,bio,avatar,followers,following,posts } = req.body;
        let user = await User.findOne({ uuid });
        if (user) errorHandler(404, 'uuid already exists');
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        user = new User({ uuid,name, password:encryptedPassword,bio,avatar,followers,following,posts });
        await user.save();
        const { password:userpassword ,...rest} = user._doc;
        return res.status(201).json({success: 'true', data : rest});
    }
    catch(err){
        next(err);
    }
}

export const createSession = async (req, res, next) => {
    try {
        const { uuid, password } = req.body;
        const user = await User.findOne({ uuid }).exec();
        if(!user) errorHandler(404, 'Credentials not found');
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) errorHandler(404, 'Credentials not found');
        const {password:pass , ...rest} = user._doc;
        // res.cookie('access_token', jwt.sign( {id:user.id} , process.env.JWT_SECRET), {
        //     httpOnly: true,
        //     sameSite: 'none',
        //     secure: true
        // });

        // return res.status(200).json({ success: 'true', data: rest });

        return res.cookie('access_token', jwt.sign({id:user.id}, process.env.JWT_SECRET), {
            httpOnly: false,
            secure: true, 
            domain: process.env.BACKEND_DOMAIN,          // must be the same as the domain in the browser
            sameSite : 'none',
          }).status(200).json({ success: 'true', data: rest });  


    }catch (err) {
        next(err);
    }
}

export const  destroySession = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        return res.status(200).json({ success: 'true', message: 'Logged out' });
    } catch (err) {
        next(err);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        if(req.params.id !== req.user.id) errorHandler(404, 'You can only update your account');
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const user = await User.findByIdAndUpdate(req.user, 
            {
                $set: {
                    uuid: req.body.uuid,
                    name: req.body.name,
                    bio: req.body.bio,
                    avatar: req.body.avatar,
                    password: req.body.password
                }
            }, 
            {new: true}
        );
        const { password:userpassword ,...rest} = user._doc;
        return res.status(200).json({ success: 'true', data: rest });
    }
    catch(err){
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        if(req.params.id !== req.user.id) errorHandler(404, 'You can only delete your account');
        await User.findByIdAndDelete(req.user);
        return res.status(200).json({ success: 'true', message: 'User deleted' });
    } catch (err) {
        next(err);
    }
} 


export const followToUser = async (req, res, next) => {
    try{
        if(req.query.currentUserId !== req.user.id) errorHandler(401, 'Unauthorized');
        if(req.query.currentUserId === req.query.followingUserId) errorHandler(401,'You can not follow yourself');
        const currentUser = await User.findOne({_id:req.query.currentUserId});
        const followingUser = await User.findOne({_id:req.query.followingUserId});
        if(!followingUser) return errorHandler(404, 'User not found');
        if(currentUser.following.includes(followingUser._id)) return errorHandler(401, 'You already follow this user');
        currentUser.following.push(followingUser._doc);
        followingUser.followers.push(currentUser._doc);
        await currentUser.save();
        await followingUser.save();
        return res.status(200).json({ success: 'true', message: `${currentUser.name} start follow ${followingUser.name}` });
    }catch(err){
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) errorHandler(404, 'User not found');
        const { password:userpassword ,...rest} = user._doc;
        return res.status(200).json({ success: 'true', data: rest });
    } catch (err) {
        next(err);
    }
}


export const getUpdatedFeed = async (req, res, next) => {
    try {
        if(req.params.id !== req.user.id) errorHandler(401, 'Unauthorized');
        let user = await User.findById(req.params.id);
        if(!user) errorHandler(404, 'User not found');
        user = await user.populate('feeds');
        const feeds = user.feeds;
        let populatedFeeds = [];
        await Promise.all(feeds.map(async (feed) => {
            // 
            const temp = await Feed.findById(feed).populate({
                path: 'post',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            });
            console.log(temp);
            populatedFeeds.push(temp);  
        }));
        
        // const unseenFeed = feeds.filter((feed) => !feed.seen);
        // feeds.map(async (feed) => {
        //     feed.seen = true;
        //     await feed.save();
        // })
        return res.status(200).json({ success: 'true', data: populatedFeeds });
    } catch (err) {
        next(err);
    }
}


export const searchUsers = async (req, res, next) => {
    try {
        if(req.query.query === '') return res.status(200).json({ success: 'true', data: [] });
        // const users = await User.find({name: new RegExp(req.query.query, 'i')});
        let users  = await User.find({name: { $regex: req.params.query, $options: 'i' }},{name: 1,avatar: 1,bio:1});
        const currentUser = await User.findById(req.user.id);
        // users = users.filter((user) => user._id.toString() !== currentUser._id.toString() && !currentUser.following.includes(user._id.toString()));
        const Freinds = users.filter((user) => user._id.toString() !== currentUser._id.toString() && currentUser.following.includes(user._id.toString()));
        const NonFriends = users.filter((user) => user._id.toString() !== currentUser._id.toString() && !currentUser.following.includes(user._id.toString()));
        if(!users) errorHandler(404, 'User not found');
        return res.status(200).json({ success: 'true', data: {Freinds,NonFriends} });
    } catch (err) {
        next(err);
    }
}

export const getFollowingUsers = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('following', 'name avatar bio');
        if (!user) errorHandler(404, 'User not found');
        return res.status(200).json({ success: 'true', data: user.following });
    } catch (err) {
        next(err);
    }
}

export const getFollowers = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('followers', 'name avatar bio');
        if(!user) errorHandler(404, 'User not found');
        return res.status(200).json({ success: 'true', data: user.followers });
        
    } catch (err) {
        next(err);
    }
}