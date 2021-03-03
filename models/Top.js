const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  score: { type: Number, required: true },
  attempts: { type: Number, required: true },
  time: { type: Number, required: true },
  fieldSize: { type: String, required: true },
  createAt: { type: String, required: true },
  playerName: { type: String, required: true },
});

module.exports = model('Top', schema);
