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

    const posts = await Post.find({ postedBy: user._id })
      .skip(skip)
      .limit(PAGE_SIZE);
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

    const isFollowed = !!aimUser.followers.find(
      el => el.nickname === authorizedUser.nickname
    );

    if (isFollowed) {
      const newFollowersArr = aimUser.followers.filter(
        el => el.nickname !== authorizedUser.nickname
      );
      aimUser.followers = newFollowersArr;
      const newFollowingArr = authorizedUser.following.filter(
        el => el.nickname !== aimUser.nickname
      );
      authorizedUser.following = newFollowingArr;
    } else {
      aimUser.followers.push({
        nickname: authorizedUser.nickname,
        profilePhoto: authorizedUser.profilePhoto
      });
      authorizedUser.following.push({
        nickname: aimUser.nickname,
        profilePhoto: aimUser.profilePhoto
      });
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

async function getFollowersOrFollowing(nickname, page, type) {
  const PAGE_SIZE = 5;
  const skip = (page - 1) * PAGE_SIZE;

  const user = await User.findOne({ nickname });

  const count = user[type].length;
  let pagesCount = Math.ceil(count / PAGE_SIZE);

  const partArr = [];

  for (let i = skip; i < skip + PAGE_SIZE; i++) {
    if (user[type][i]) {
      partArr.push(user[type][i]);
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

    const { page } = req.query;

    const result = await getFollowersOrFollowing(nickname, page, 'followers');

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

    const { page } = req.query;
    const result = await getFollowersOrFollowing(nickname, page, 'following');

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

module.exports = router;
