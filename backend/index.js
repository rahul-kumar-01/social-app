import express, { json } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


const port = process.env.PORT ;
const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_URI, 'http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));


import userRoute from './routes/user-route.js'
import postRoute from './routes/post-route.js'



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);

app.get('/api', (req,res) => {
    return res.json({message: 'Welcome to Social App API'});
});

app.get('/api/todos', (req,res) => {
    const todos = [
        {id:1, title: 'Todo 1', completed: false},
        {id:2, title: 'Todo 2', completed: true},
        {id:3, title: 'Todo 3', completed: false},
    ];
    return res.json({todos});
});

app.use('/api/user', userRoute);
app.use('/api/post',postRoute);

app.use((err,req,res,next)=> {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({success:'false',message});
})

