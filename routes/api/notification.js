const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('../../models/Notification');
const auth = require('../../middleware/auth');

// @route  GET api/users/message
// @desc    Get the conversation users
// @access  Private
router.get('/', auth, async (req, res) => {
  const readerId = req.user.id;

  try {
    const notification = await Notification.find({
      receiver: { $in: mongoose.Types.ObjectId(readerId) }
    }).populate('sender', ['name', 'avatar']);
    res.json(notification);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
