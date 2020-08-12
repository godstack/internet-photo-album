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

module.exports = router;
