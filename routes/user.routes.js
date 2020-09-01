const { Router } = require('express');
const router = Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const mongodb = require('mongodb');
const path = require('path');
const binary = mongodb.Binary;

// /api/user/profile
router.get('/profile/:nickname', auth, async (req, res) => {
  try {
    const { page } = req.query;

    const PAGE_SIZE = 5;
    const skip = (page - 1) * PAGE_SIZE;

    const { nickname } = req.params;

    const user = await User.findOne({ nickname });

    if (!user) {
      return res.status(404).json({ message: 'Such user does not exist' });
    }

    const postsFromDB = await (
      await Post.find({ postedBy: user._id })
    ).reverse();

    const posts = [];

    for (let i = skip; i < skip + PAGE_SIZE; i++) {
      if (postsFromDB[i]) {
        posts.push(postsFromDB[i]);
      } else {
        break;
      }
    }

    const count = await Post.find({ postedBy: user._id }).countDocuments();
    let pagesCount = Math.ceil(count / PAGE_SIZE);

    res.json({ posts, user, pagesCount, postsCount: count });
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

router.put('/profile/avatar', auth, async (req, res) => {
  try {
    const file = req.files.image.data;

    const extension = path.extname(req.files.image.name);
    const size = req.files.image.data.length;

    const allowedExtensions = /png|jpeg|jpg|gif/;

    if (!allowedExtensions.test(extension)) {
      throw 'Upload images only!';
    }
    if (size > 5 * 1024 * 1024) {
      throw 'File must be less than 5MB';
    }

    const user = await User.findById(req.user.userId);

    user.profilePhoto = file;

    await user.save();

    res.json(file);
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

router.post('/follow/:nickname', auth, async (req, res) => {
  try {
    const authorizedUser = await User.findById(req.user.userId);

    const aimUser = await User.findOne({ nickname: req.params.nickname });

    const isFollowed = !!aimUser.followers.find(el =>
      el.equals(authorizedUser._id)
    );

    if (isFollowed) {
      const newFollowersArr = aimUser.followers.filter(
        el => !el.equals(authorizedUser._id)
      );
      aimUser.followers = newFollowersArr;
      const newFollowingArr = authorizedUser.following.filter(
        el => !el.equals(aimUser._id)
      );
      authorizedUser.following = newFollowingArr;
    } else {
      aimUser.followers.push(authorizedUser._id);
      authorizedUser.following.push(aimUser._id);
    }

    await aimUser.save();

    await authorizedUser.save();

    res.json({
      followersAim: aimUser.followers,
      followingAuth: authorizedUser.following
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

async function getFollowersOrFollowing(nickname, page, search, type) {
  const PAGE_SIZE = 5;
  const skip = (page - 1) * PAGE_SIZE;

  const user = await User.findOne({ nickname });

  const userList = [];
  const deletedUsers = [];

  for (let i = 0; i < user[type].length; i++) {
    const item = await User.findById(user[type][i]);

    if (item && item.nickname.includes(search)) {
      userList.push(user[type][i]);
    } else {
      deletedUsers.push(user[type][i]);
    }
  }

  for (let i = 0; i < deletedUsers.length; i++) {
    user[type] = user[type].filter(el => el !== deletedUsers[i]);
  }

  await user.save();

  const count = userList.length;
  let pagesCount = Math.ceil(count / PAGE_SIZE);

  const partArr = [];

  for (let i = skip; i < skip + PAGE_SIZE; i++) {
    if (userList[i]) {
      const followUser = await User.findById(userList[i]);

      partArr.push({
        _id: followUser._id,
        nickname: followUser.nickname,
        profilePhoto: followUser.profilePhoto
      });
    } else {
      break;
    }
  }

  const result = {
    userList: partArr,
    pagesCount
  };

  return result;
}

router.get('/:nickname/followers', auth, async (req, res) => {
  try {
    const { nickname } = req.params;

    let { search } = req.query;

    search = search.toLowerCase();

    const { page } = req.query;

    const result = await getFollowersOrFollowing(
      nickname,
      page,
      search,
      'followers'
    );

    res.json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

router.get('/:nickname/following', auth, async (req, res) => {
  try {
    const { nickname } = req.params;

    let { search } = req.query;

    search = search.toLowerCase();

    const { page } = req.query;
    const result = await getFollowersOrFollowing(
      nickname,
      page,
      search,
      'following'
    );

    res.json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    res.json({
      profilePhoto: user.profilePhoto,
      email: user.email,
      nickname: user.nickname
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

router.post('/settings/photo', auth, async (req, res) => {
  try {
    if (!req.files.image.data) {
      return res.status(400).json({ message: 'Select an image!' });
    }

    const file = binary(req.files.image.data);
    const extension = path.extname(req.files.image.name);
    const size = req.files.image.data.length;

    const allowedExtensions = /png|jpeg|jpg|gif/;

    if (!allowedExtensions.test(extension)) {
      throw 'Upload images only!';
    }
    if (size > 5 * 1024 * 1024) {
      throw 'File must be less than 5MB';
    }

    const user = await User.findById(req.user.userId);

    user.profilePhoto = file;

    await user.save();

    res.json({ message: 'Profile picture updated successfully' });
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

router.put('/settings/change', auth, async (req, res) => {
  try {
    let { nickname, email } = req.body;

    nickname = nickname.toLowerCase();

    email = email.toLowerCase();

    const regexForEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const isEmail = regexForEmail.test(email);

    if (!isEmail) {
      return res.status(400).json({ message: 'Wrong email, try again' });
    }

    if (nickname.length < 6) {
      return res
        .status(400)
        .json({ message: 'Nickname should be longer, than 6 characters' });
    }

    const user = await User.findById(req.user.userId);

    user.nickname = nickname;
    user.email = email;

    await user.save();

    res.json({
      new: { nickname, email },
      message: 'Profile data updated successfully'
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

module.exports = router;
