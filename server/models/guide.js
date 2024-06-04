const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
  travelPlans: {
    type: [{ type: Schema.Types.ObjectId, ref: "travelplan" }],
    default: [],
  },
});

guideSchema.pre("save", async function (next) {
  const user = this;
  // Check if the password has been modified or is new
  if (!user.isModified("password")) return next();

  try {
    // Generate a salt and hash pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("guide", guideSchema);
