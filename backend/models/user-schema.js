import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: 'Hello there! I am using Social Media.'
  },
  avatar: {
    type: String,
    default: 'https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg'
  },
  followers: {
    type: [
      mongoose.Schema.Types.ObjectId,
    ],
    ref: 'User',
    default: []
  },
  following: {
    type: [
      mongoose.Schema.Types.ObjectId
    ],
    ref: 'User',
    default: []
  },
  posts: {
    type: [
      mongoose.Schema.Types.ObjectId
    ],
    ref: 'Post',
    default: []
  },
  feeds : {
    type: [
      mongoose.Schema.Types.ObjectId
    ],
    ref: 'Feed',
    default: []
  }
},
{
  timestamps: true

});

const User = mongoose.model('User', userSchema);
export default User;