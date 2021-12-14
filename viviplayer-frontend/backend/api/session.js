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
    return res.status(400).json({ errors: [{ msg: 'You do not have permission' }] });
  }

  try {
    let newSession = new Session({
      tan: faker.finance.bitcoinAddress(),
      owner: req.user.id,
      videoPath:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    });

    await newSession.save();
    return res.json(newSession);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/session/
// @desc     get session
// @access   private
router.get('/', auth, async (req, res) => {
  const session = await Session.findOne({ owner: req.user.id });
  if (!session) {
    return res.status(400).json({ errors: [{ msg: 'Session not found' }] });
  }
  try {
    return res.status(200).json(session);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
// @route    POST api/session/change-tan
// @desc     change-tan,only moderator can change the tan in session
// @access   private
router.put('/change-tan', auth, async (req, res) => {
  const session = await Session.findOne({ owner: req.user.id });
  if (!session) {
    return res.status(400).json({ errors: [{ msg: 'Session not found' }] });
  }

  try {
    const { newTan } = req.body;
    if (newTan.length < 6) {
      return res.status(400).json({ msg: 'TAN must have at least 6 digits' });
    }
    await Session.findOneAndUpdate(
      { owner: req.user.id },
      {
        $set: {
          tan: newTan
        }
      },
      {
        useFindAndModify: false
      }
    );
    return res.status(200).json({ msg: 'you have successfully changed Tan' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/session/change-status-session
// @desc     only moderator can change the status of session
// @access   private
router.put('/change-status-session', auth, async (req, res) => {
  const session = await Session.findOne({ owner: req.user.id });
  if (!session) {
    return res.status(400).json({ errors: [{ msg: 'Session not found' }] });
  }

  try {
    await Session.findOneAndUpdate(
      { owner: req.user.id },
      {
        $set: {
          isOpen: !session.isOpen
        }
      },
      {
        useFindAndModify: false
      }
    );
    return res.status(200).json({ msg: 'you have successfully changed status of session' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/session/join-session
// @desc     User uses TAN to join session
// @access   public
router.post('/join-session', async (req, res) => {
  const { tan } = req.body;
  if (!tan) {
    return res.status(400).json({ msg: 'you must enter TAN to enter the room' });
  }
  const session = await Session.findOne({ tan: tan });
  if (!session || !session.isOpen) {
    return res.status(400).json({ msg: 'Session not found' });
  }

  try {
    let user = new User({
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });
    await user.save();
    let userLoggedViaTAN = await User.findOne({ email: user.email });
    await Session.findOneAndUpdate(
      { tan: tan },
      {
        $push: {
          userLists: { user: userLoggedViaTAN._id }
        }
      },
      {
        useFindAndModify: false
      }
    );
    return res.json(userLoggedViaTAN);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
