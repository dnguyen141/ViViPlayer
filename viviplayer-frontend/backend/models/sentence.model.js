const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SentenceSchema = new mongoose.Schema({
  owner: {
    type: String
  },
  session: {
    type: Schema.Types.ObjectId
  },
  content: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('sentenceSchema', SentenceSchema);
