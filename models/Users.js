const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('Users', UserSchema);

module.exports = User;

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(16, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}