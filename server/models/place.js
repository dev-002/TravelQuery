const mongoose = require("mongoose");
const { Schema } = mongoose;

const placeSchema = Schema({
  name: { type: String, required: true },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "home_stay",
      "hotel",
      "restaurant",
      "attractions",
      "nature",
      "other",
    ],
    required: true,
  },
  services: { type: [String], defualt: [], required: true },
  geoLocation: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  },
  address: {
    type: String,
  },
  bearing: {
    type: String,
    required: true,
    default: "east",
  },
  price_level: {
    type: Number,
    required: true,
  },
  images: { type: [String], default: [] },
  rating: {
    type: Number,
    default: 3.5,
  },
  contact: {
    type: [Number],
  },
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
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  userExp: {
    type: [String],
  },
});

module.exports = mongoose.model("place", placeSchema);
