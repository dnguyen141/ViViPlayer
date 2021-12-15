const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserStory = new mongoose.Schema({
  owner: {
    type: String
  },
  session: {
    type: Schema.Types.ObjectId
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('userStory', SessionSchema);
