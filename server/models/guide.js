const mongoose = require("mongoose");
const { Schema } = mongoose;

const guideSchema = Schema({
  profile: { type: String },
  role: { type: Number, default: 3 },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Hey! Let me be your guide!",
  },
  mobile: {
    unique: true,
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  price_level: {
    type: Number,
  },
  gender: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
  },
  rating: {
    type: Number,
    default: 2.5,
  },
  area: { type: [String], required: true, default: [] },
  reviews: {
    type: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        rating: { type: Number, required: true },
        comment: String,
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("guide", guideSchema);
