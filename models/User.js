const { model, Schema, Types } = require('mongoose');

const schema = new Schema({
  nickname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: [{ type: Types.ObjectId, ref: 'Post' }],
  likedPosts: [{ type: Types.ObjectId, ref: 'Post' }],
  followers: [{ type: Types.ObjectId, ref: 'User' }],
  following: [{ type: Types.ObjectId, ref: 'User' }],
  profilePhoto: { type: Buffer }
});

module.exports = model('User', schema);
