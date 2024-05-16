const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  profile: { type: String },
  role: { type: Number, default: 2 },
  name: { type: String, required: true },
  mobile: { type: Number, required: true },
  password: { type: String, required: true },
  gender: { type: Number, enum: [1, 2, 3], required: true },
  travelPlans: {
    type: [{ type: Schema.Types.ObjectId, ref: "travelPlan" }],
    default: [],
  },
  wishlist: {
    type: [{ type: Schema.Types.ObjectId, ref: "place" }],
    default: [],
  },
  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("user", userSchema);
