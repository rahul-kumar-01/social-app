import mongoose from 'mongoose';

const avatarUrls = [
  'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png',
  'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjc5MS10YW5nLTM1LnBuZw.png',

]

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
    default: avatarUrls[Math.round(Math.random()*avatarUrls.length)]
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