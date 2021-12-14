const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user.model.js');
const Session = require('../models/session.model');
var faker = require('faker');

// @route    POST api/session/create-session
// @desc     create-session ,only moderator can create new session
// @access   private
router.post('/create-session', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user.is_staff == true) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'You do not have permission to create session' }] });
  }

  try {
    let newSession = new Session({
      tan: faker.finance.bitcoinAddress(),
      owner: req.user.id,
      videoPath: videoPath
        ? videoPath
        : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    });

    await newSession.save();
    return res.json(newSession);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
