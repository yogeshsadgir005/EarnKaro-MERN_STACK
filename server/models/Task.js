const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  reward: Number,
  category: String,
  packageName: String,
  link: String,
  banner: String,
isFeatured: { type: Boolean, default: false },
  isSlider: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);