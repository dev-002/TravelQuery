const bcrypt = require("bcrypt");
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

userSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("user", userSchema);
