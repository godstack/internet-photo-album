const { Router } = require('express');
const config = require('config');
const router = Router();
const auth = require('../middleware/auth.middleware');

const path = require('path');

const mongodb = require('mongodb');

const binary = mongodb.Binary;

const Post = require('../models/Post');

const User = require('../models/User');

// /api/post/upload
router.post('/upload', auth, async (req, res) => {
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

    const post = new Post({
      postedBy: req.user.userId,
      photo: file
    });

    await post.save();

    res.status(201).json(post);
  } catch (e) {
    res
      .status(500)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

//api/post/delete

router.delete('/delete', auth, async (req, res) => {
  try {
    const { userId } = req.user;

    const { postId } = req.body;

    const user = await User.findById(userId);

    user.likedPosts = user.likedPosts.filter(el => !el.equals(postId));
    user.posts = user.posts.filter(el => !el.equals(postId));

    await user.save();

    const post = await Post.findByIdAndDelete(postId);

    res.json({ message: 'Deleted successfully' });
  } catch (e) {
    res
      .status(500)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

// /api/post/like

router.put('/like', auth, async (req, res) => {
  try {
    const { userId } = req.user;

    const { postId } = req.body;

    const post = await Post.findById(postId);

    const isUserLiked = post.likes.find(el => el.equals(userId));

    if (isUserLiked) {
      const newLikesArr = post.likes.filter(el => !el.equals(userId));
      post.likes = newLikesArr;
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (e) {
    res
      .status(500)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

// get all user posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user.userId });

    res.json(posts);
  } catch (e) {
    res
      .status(500)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const user = await User.findById(post.postedBy);

    res.json({ post, nickname: user.nickname });
  } catch (e) {
    res
      .status(500)
      .json({ message: e.message || 'Something went wrong, try again' });
  }
});

module.exports = router;
