const { Router } = require('express');
const router = Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

// /api/user/profile
router.get('/profile/:nickname', auth, async (req, res) => {
  try {
    const { nickname } = req.params;

    const user = await User.findOne({ nickname });

    if (!user) {
      return res.status(404).json({ message: 'Such user does not exist' });
    }

    const posts = await Post.find({ postedBy: user._id });

    res.json({ posts, user });
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

router.get('/:nickname/followers', auth, async (req, res) => {
  try {
    const { nickname } = req.params;

    const user = await User.findOne({ nickname });

    res.json({ userList: user.followers });
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

router.get('/:nickname/following', auth, async (req, res) => {
  try {
    const { nickname } = req.params;

    const user = await User.findOne({ nickname });

    res.json({ userList: user.following });
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

module.exports = router;
