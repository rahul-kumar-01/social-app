import express from 'express';
import {
    createSession,
    createUser,
    destroySession,
    updateUser,
    deleteUser,
    followToUser,
    getUser,
    getUpdatedFeed,
    searchUsers,
    getFollowingUsers,
    getFollowers
} from '../controllers/user-controller.js'
import { verfiyToken } from '../utils/verfiyToken.js';

const router = express.Router();

router.get('/get-user/:id',getUser);
router.post('/create-user',createUser);
router.post('/create-session',createSession);

router.get('/destroy-session',destroySession);

router.post('/update-user/:id',verfiyToken,updateUser);
router.get('/delete-user/:id',verfiyToken,deleteUser);
router.get('/get-feed/:id',verfiyToken,getUpdatedFeed);
router.get('/search-users/:query',verfiyToken,searchUsers);      //query is name of user

router.get('/follow-to/',verfiyToken, followToUser);
router.get('/get-following-users/:id',verfiyToken, getFollowingUsers);
router.get('/get-followers/:id',verfiyToken, getFollowers);


export default router;