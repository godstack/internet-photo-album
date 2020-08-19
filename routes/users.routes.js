const { Router } = require('express');
const router = Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const { find } = require('../models/Post');

// /api/users
router.get('/get', auth, async (req, res) => {
  try {
    const { page, search } = req.query;

    const PAGE_SIZE = 5;
    const skip = (page - 1) * PAGE_SIZE;

    let users = await User.find({});

    users = users.filter(el => el.nickname.includes(search));

    const partArr = [];

    for (let i = skip; i < skip + PAGE_SIZE; i++) {
      if (users[i]) {
        partArr.push(users[i]);
      } else {
        break;
      }
    }

    let count;
    if (!search) {
      count = await User.find().countDocuments();
    } else {
      count = users.length;
    }

    let pagesCount = Math.ceil(count / PAGE_SIZE);

    let userList = [];

    for (const element of partArr) {
      userList.push({
        nickname: element.nickname,
        profilePhoto: element.profilePhoto,
        _id: element._id
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
