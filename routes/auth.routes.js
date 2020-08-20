const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { check, validationResult, oneOf } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = Router();

// /api/auth/register
router.post(
  '/register',
  [
    check('email').isEmail().withMessage('Wrong email'),
    check('nickname', 'Wrong nickname')
      .exists()
      .withMessage('nickname is required')
      .isLength({ min: 3, max: 14 })
      .withMessage('wrong nickname length (From 3 to 14 characters)'),

    check('password')
      .isLength({
        min: 6
      })
      .withMessage('Password should be longer, than 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: 'Wrong registration data' });
      }

      const { email, password, nickname } = req.body;

      const candidateEmail = await User.findOne({ email });
      const candidateNickname = await User.findOne({ nickname });

      if (candidateEmail) {
        return res
          .status(400)
          .json({ message: 'User already exists, use another email' });
      }

      if (candidateNickname) {
        return res
          .status(400)
          .json({ message: 'User already exists, use another nickname' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({ email, nickname, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: 'New user was created' });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' });
    }
  }
);

// /api/auth/login
router.post(
  '/login',
  [
    oneOf([
      check('email')
        .exists()
        .withMessage('email is required')
        .normalizeEmail()
        .isEmail(),
      check('email', 'Wrong nickname')
        .exists()
        .withMessage('nickname is required')
        .isLength({ min: 3 })
        .withMessage('wrong nickname length')
    ]),

    check('password', 'Enter correct password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: 'Wrong login data' });
      }

      const { email, password } = req.body;

      const regexForEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const isEmail = regexForEmail.test(email);

      const user = isEmail
        ? await User.findOne({ email })
        : await User.findOne({ nickname: email });

      if (!user) {
        return res.status(400).json({ message: 'Such user does not exist' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Wrong password, try again' });
      }

      const token = jwt.sign(
        {
          userId: user.id
        },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      );

      res.json({
        token,
        userId: user.id,
        nickname: user.nickname,
        following: user.following
      });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong, try again' });
    }
  }
);

module.exports = router;
