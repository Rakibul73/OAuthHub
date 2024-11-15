const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  google: {
    id: String,
    email: String
  },
  facebook: {
    id: String,
    email: String
  },
  linkedin: {
    id: String,
    email: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
