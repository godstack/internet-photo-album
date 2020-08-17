const { Router } = require('express');
const router = Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

// /api/users
router.get('/get', auth, async (req, res) => {
  try {
    const { page } = req.query;

    const PAGE_SIZE = 5;
    const skip = (page - 1) * PAGE_SIZE;

    const users = await User.find({}).skip(skip).limit(PAGE_SIZE);
    const count = await User.find().countDocuments();
    let pagesCount = Math.ceil(count / PAGE_SIZE);

    let userList = [];

    for (const element of users) {
      userList.push({
        nickname: element.nickname,
        profilePhoto: element.profilePhoto
      });
    }

    res.json({ userList, pagesCount });
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

module.exports = router;
