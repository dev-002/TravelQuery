const Guide = require("../models/guide");
const User = require("../models/user");
const TravelPlan = require("../models/travelPlan");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const fetchAllGuide = async (req, res, next) => {
  try {
    const guides = await Guide.find();
    return res.status(200).json({ ack: true, guides });
  } catch (err) {
    console.log("Error in fetching guide:", err);
    return res.status(500).json({ ack: false, err });
  }
};

const fetchSpecificGuide = async (req, res, next) => {
  const { guide_id } = req.body;
  try {
    const guide = await Guide.findById(guide_id);
    if (guide) return res.status(200).json({ ack: true, guide });
    else throw new Error("No Guide Found");
  } catch (err) {
    console.log("Error in fetching guide:", err);
    return res.status(500).json({ ack: false, err });
  }
};

const updateGuide = async (req, res, next) => {
  const { guide_id, update } = req.body;
  try {
    let guide = await Guide.findById(guide_id);
    if (guide) {
      guide = await Guide.findByIdAndUpdate(
        guide_id,
        { update },
        { new: true }
      );
      if (guide) return res.status(200).json({ ack: true, guides });
    } else throw new Error("No Guide Found");
  } catch (err) {
    console.log("Error in fetching guide:", err);
    return res.status(500).json({ ack: false, err });
  }
};

const deleteGuide = async (req, res, next) => {
  const { guide_id } = req.body;
  try {
    let guide = await Guide.findById(guide_id);
    if (guide) {
      guide = await Guide.findByIdAndDelete(guide_id, { new: true });
      if (guide) return res.status(200).json({ ack: true, guides });
    } else throw new Error("No Guide Found");
  } catch (err) {
    console.log("Error in fetching guide:", err);
    return res.status(500).json({ ack: false, err });
  }
};

const fetchGuideAreas = async (req, res, next) => {
  const data = req.data;
  try {
    let guide = await Guide.findOne({ mobile: data.mobile });
    if (guide) return res.status(200).json({ ack: true, areas: guide.area });
    else throw new Error("No Guide Found");
  } catch (err) {
    console.log("Error in fetching guide:", err);
    return res.status(500).json({ ack: false, err });
  }
};

const fetchTravelPlans = async (req, res, next) => {
  const data = req.data;
  const all = req.headers.all;
  try {
    let guide = await Guide.findOne({ mobile: data.mobile });
    const travelPlanArr = [];

    await Promise.all(
      guide.travelPlans.map(async (plan) => {
        let travelPlan = await TravelPlan.findById(plan)
            .populate("placesVisited")
            .populate("members"),
          date = new Date(),
          start = new Date(travelPlan.date?.start);
        if (all) {
          if (
            start.getDate() >= date.getDate() &&
            start.getMonth() >= date.getMonth() &&
            start.getFullYear() >= date.getFullYear()
          )
            travelPlanArr.push(travelPlan);
        } else travelPlanArr.push(travelPlan);
      })
    );
    return res.status(200).json({ ack: true, travelplans: travelPlanArr });
  } catch (err) {
    console.log("Error in fetching guide:", err);
    return res.status(500).json({ ack: false, err });
  }
};

const fetchReviews = async (req, res, next) => {
  const data = req.data;
  try {
    const guide = await Guide.findOne({ mobile: data.mobile }).populate(
      "reviews"
    );
    if (guide)
      return res
        .status(200)
        .json({ ack: true, reviews: guide.reviews, rating: guide.rating });
  } catch (err) {
    console.log("Error fetching reviews", err);
    return res.status(500).json({ ack: false, err });
  }
};

const searchGuide = async (req, res, next) => {
  const { search } = req.body;
  try {
    const searchRegex = new RegExp(search, "i");
    let guides;
    if (search) {
      guides = await Guide.find({ name: { $regex: searchRegex } });
    } else {
      guides = await Guide.find({});
    }
    res.status(200).json({ ack: true, guides });
  } catch (err) {
    console.log("Error while fetching members: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const postReview = async (req, res, next) => {
  const { rating, comment, id } = req.body;
  const data = req.data;
  try {
    let guide = await Guide.findById(id);
    const user = await User.findOne({ mobile: data.mobile });
    if (Boolean(guide) && Boolean(user)) {
      guide = await Guide.findByIdAndUpdate(id, {
        $push: {
          reviews: { user: user._id, rating, comment },
        },
      });
      guide = await Guide.findById(id);
      res.status(200).json({ ack: true, guide });
    } else throw new Error("No guide found");
  } catch (err) {
    console.log("Error while fetching members: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

// for guide screen
const fetchGuideReview = async (req, res, next) => {
  const { id } = req.body;

  try {
    const guide = await Guide.findById(id).populate("reviews");
    if (guide)
      return res
        .status(200)
        .json({ ack: true, reviews: guide.reviews, rating: guide.rating });
  } catch (err) {
    console.log("Error fetching reviews", err);
    return res.status(500).json({ ack: false, err });
  }
};

// Guides Tab Screen

const quoteGen = require("../utility/QuoteGenerator");
const QuoteGenerator = async (req, res, next) => {
  const quote = await quoteGen();
  return res.status(200).json({ ack: true, quote });
};

module.exports = {
  fetchAllGuide,
  fetchSpecificGuide,
  updateGuide,
  deleteGuide,
  fetchGuideAreas,
  fetchTravelPlans,
  fetchReviews,
  searchGuide,
  postReview,
  fetchGuideReview,

  QuoteGenerator,
};
