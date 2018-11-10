const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const rankSchema = new Schema({
  tag: String,
  rating: Number
})

module.exports = mongoose.model('Rank', rankSchema);