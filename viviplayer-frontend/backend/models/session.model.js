const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Session 1'
  },
  owner: {
    type: Schema.Types.ObjectId
  },
  tan: {
    type: String,
    default: ''
  },
  videoPath: {
    type: String
  },
  userLists: [
    {
      user: {
        type: Schema.Types.ObjectId
      }
    }
  ],
  userStoryList: [
    {
      userName: {
        type: String
      },
      content: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  sentenceLists: [
    {
      userName: {
        type: String
      },
      content: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  markersList: [
    {
      time: {
        type: String
      },
      text: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  isOpen: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('session', SessionSchema);
