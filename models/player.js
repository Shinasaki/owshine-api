const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const playerSchema = new Schema({
  tag: String,
  rating: Number,
  portrait: String,
  profile: Object
})

module.exports = mongoose.model('Player', playerSchema);