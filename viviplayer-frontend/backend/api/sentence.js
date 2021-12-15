const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user.model.js');
const Session = require('../models/session.model');

// @route    GET api/sentence
// @desc     Get all sentences
// @access   Public
router.get('/', async (req, res) => {
  const { sessionId } = req.body;
  const sentenceLists = await Session.findOne({ _id: sessionId });
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
  const { owner, sessionId, sentence } = req.body;
  const Owner = await User.findOne({ _id: owner });
  if (!Owner) {
    return res.status(400).json({ errors: [{ msg: 'You do not have permission' }] });
  }
  const sessionRef = await Session.findOne({ _id: sessionId });
  if (!sessionRef) {
    return res.status(400).json({ errors: [{ msg: 'Session not found' }] });
  }
  let check = sessionRef.userLists.find((x) => {
    if (x.user.toString() === Owner._id.toString()) {
      return true;
    }
  });
  if (!check) {
    return res.status(400).json({ errors: [{ msg: 'You do not have permission' }] });
  }
  try {
    await Session.findOneAndUpdate(
      { _id: sessionId },
      {
        $push: {
          sentenceLists: { userName: Owner.name, content: sentence }
        }
      },
      {
        useFindAndModify: false
      }
    );
    return res.status(200).json({ msg: 'you have successfully written the sentence' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route    Put api/edit-sentence
// @desc     edit sentence
// @access   Public
router.put('/edit-sentence', async (req, res) => {
  const { owner, sessionId, sentence, sentenceId } = req.body;
  const Owner = await User.findOne({ _id: owner });
  if (!Owner) {
    return res.status(400).json({ errors: [{ msg: 'You do not have permission' }] });
  }
  const sessionRef = await Session.findOne({ _id: sessionId });
  if (!sessionRef) {
    return res.status(400).json({ errors: [{ msg: 'Session not found' }] });
  }
  try {
    // Pull out sentence
    const findSentence = sessionRef.sentenceLists.find((sen) => sen.id === sentenceId);
    // Make sure sentence exists
    if (!findSentence) {
      return res.status(404).json({ msg: 'sentence does not exist' });
    }
    // update sentence
    sessionRef.sentenceLists.find((sen) => {
      if (sen.id === sentenceId) {
        sen.content = sentence;
      }
    });
    await sessionRef.save();
    res.json(sessionRef);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route    delete api/delete-sentence
// @desc     delete sentence
// @access   Public
router.delete('/delete-sentence', async (req, res) => {
  const { owner, sessionId, sentenceId } = req.body;
  const Owner = await User.findOne({ _id: owner });
  if (!Owner) {
    return res.status(400).json({ errors: [{ msg: 'You do not have permission' }] });
  }
  const sessionRef = await Session.findOne({ _id: sessionId });
  if (!sessionRef) {
    return res.status(400).json({ errors: [{ msg: 'Session not found' }] });
  }
  try {
    // Pull out sentence
    const findSentence = sessionRef.sentenceLists.find((sen) => sen.id === sentenceId);
    // Make sure sentence exists
    if (!findSentence) {
      return res.status(404).json({ msg: 'sentence does not exist' });
    }

    // delete sentence
    const removeIndex = sessionRef.sentenceLists.findIndex((item) => item._id === sentenceId);
    sessionRef.sentenceLists.splice(removeIndex, 1);

    await sessionRef.save();
    return res.json(sessionRef);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
