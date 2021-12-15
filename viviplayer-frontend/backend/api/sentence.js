const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user.model.js');
const Session = require('../models/session.model');

// @route    GET api/sentence
// @desc     Get all sentences
// @access   Private
router.get('/', auth, async (req, res) => {
  const sentenceLists = await Session.findOne({ owner: req.user.id });
  if (!sentenceLists) {
    return res.status(400).json({ errors: [{ msg: 'sentence not found' }] });
  }
  try {
    return res.json(sentenceLists.sentenceLists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/sentence
// @desc     create one sentence
// @access   Public
router.post('/create-sentence', async (req, res) => {
  const { owner, sessionId } = req.body;
  const Owner = await User.findOne({ _id: owner });
  const sessionRef = await Session.findOne({ _id: sessionId });
  res.json(sessionRef);
});

module.exports = router;
