const { model, Schema, Types } = require('mongoose');

const schema = new Schema({
  description: {
    type: String
  },
  likes: [{ type: Types.ObjectId, ref: 'User' }],
  photo: { type: Buffer, required: true },
  date: { type: Date, default: Date.now },
  postedBy: { type: Types.ObjectId, ref: 'User' }
});

module.exports = model('Post', schema);
