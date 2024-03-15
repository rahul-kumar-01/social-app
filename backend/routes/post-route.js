import router from 'express';
import { createPost, deletePost, viewPost, getPost } from '../controllers/post-controller.js';
import { verfiyToken } from '../utils/verfiyToken.js';

const postRoute = router();

postRoute.get('/', (req, res) => {
    return res.send('Post Route');
});

// id belong to post which user want to view 
postRoute.get('/view-post/:id', verfiyToken, viewPost);

// id belong to user which want to create the post
postRoute.post('/create-post/:id', verfiyToken, createPost);

// id belong to post which user want to delete the post
postRoute.delete('/delete-post/:id', verfiyToken, deletePost);


postRoute.get('/get-post/:id', verfiyToken, getPost);



export default postRoute;