const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Posts');
const Profile = require('../../models/Profile');
// @route   POST api/post
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required.').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/post
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
// @route   GET api/post/:id
// @desc    Get post bu id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes('Cast to ObjectId failed')) {
      return res.status(400).json({ msg: 'Post not found.' });
    }
    res.status(500).send('Server error!');
  }
});

// @route   DELET api/post/:id
// @desc    delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    } else {
      await post.remove();
    }

    res.json({ msg: 'Post removed' });
  } catch (error) {
    console.error(error.message);
    if (error.message.includes('Cast to ObjectId failed')) {
      return res.status(400).json({ msg: 'Post not found.' });
    }
    res.status(500).send('Server error!');
  }
});

// @route   DELET api/post/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELET api/post/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/post/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required.').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(400).json({ msg: 'Post not found.' });
      }
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error(error.message);

      if (error.message.includes('Cast to ObjectId failed')) {
        return res.status(400).json({ msg: 'Post not found.' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   DELET api/post/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //  Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment dose not exist' });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'User not authorized' });
    }
    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes('Cast to ObjectId failed')) {
      return res.status(400).json({ msg: 'Post not found.' });
    }
    res.status(500).send('Server error');
  }
});
module.exports = router;
