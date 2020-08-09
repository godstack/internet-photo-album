const { model, Schema, Types } = require('mongoose');

const schema = new Schema({
  likes: [{ type: Types.ObjectId, ref: 'User' }],
  postImage: { type: Buffer, required: true },
  date: { type: Date, default: Date.now },
  owner: { type: Types.ObjectId, ref: 'User' }
});

module.exports = model('Post', schema);
