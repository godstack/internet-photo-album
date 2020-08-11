const { Router } = require('express');
const router = Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth.middleware');

// /api/user/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const { userId } = req.user;

    const posts = await Post.find({ postedBy: userId });

    res.json(posts);
  } catch (e) {
    res.status(400).json({ message: 'Something went wrong, try again' });
  }
});

module.exports = router;
