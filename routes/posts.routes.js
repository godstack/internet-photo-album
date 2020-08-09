const { Router } = require('express');
const config = require('config');
const router = Router();
const auth = require('../middleware/auth.middleware');

const path = require('path');

const mongodb = require('mongodb');

const binary = mongodb.Binary;

const Post = require('../models/Post');

// /api/post/upload
router.post('/upload', auth, async (req, res) => {
  try {
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

    const post = new Post({
      owner: req.user.userId,
      postImage: file
    });

    await post.save();

    res.status(201).json(post);
  } catch (e) {
    res
      .status(500)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

// get all user posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ owner: req.user.userId });

    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, try again' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.json(post);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, try again' });
  }
});

module.exports = router;
