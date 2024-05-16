const mongoose = require("mongoose");
const { Schema } = mongoose;

const travelPlanSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: { start: Date, end: Date },
    required: true,
  },
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: "user" }],
    required: true,
  },
  totalBudget: {
    type: Number,
    required: true,
  },
  placesVisited: {
    type: [{ type: Schema.Types.ObjectId, ref: "place" }],
    required: true,
  },
  totalTripDays: {
    type: Number,
    requried: true,
  },
  guidesOpted: {
    type: [{ type: Schema.Types.ObjectId, ref: "guide" }],
    default: [],
  },
  craetedAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("travelPlan", travelPlanSchema);
