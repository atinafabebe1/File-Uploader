const mongoose = require('mongoose');

const myfileSchema = new mongoose.Schema({
  name: String,
  email: String,
  file: String
});

module.exports = mongoose.model('Myfile', myfileSchema);
