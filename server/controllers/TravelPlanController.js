const User = require("../models/user");
const Guide = require("../models/guide");
const Place = require("../models/place");
const TravelPlan = require("../models/travelPlan");
const ObjectId = require("mongoose").Types.ObjectId;

const fetchAllPlan = async (req, res, next) => {
  const data = req.data;
  try {
    let travelPlans = await User.findOne({ mobile: data.mobile }).populate(
      "travelPlans"
    );
    if (travelPlans) travelPlans = travelPlans.travelPlans;

    const travelExpand = [];
    await Promise.all(
      travelPlans.map(async (t) => {
        const temp = await TravelPlan.findById(t._id)
          .populate("members")
          .populate("placesVisited")
          .populate("guidesOpted");
        travelExpand.push(temp);
      })
    );

    return res.status(200).json({ ack: true, travelPlans: travelExpand });
  } catch (err) {
    console.log("Error while fetching", err);
    return res.status(500).json({ ack: false, err });
  }
};

const fetchSpecificPlan = async (req, res, next) => {
  const id = req.body?.id;

  try {
    let travelPlan = await TravelPlan.findById(id)
      .populate("members")
      .populate("placesVisited")
      .populate("guidesOpted");

    return res.status(200).json({ ack: true, travelPlan });
  } catch (err) {
    console.log("Error while fetching", err);
    return res.status(500).json({ ack: false, err });
  }
};

const createPlan = async (req, res, next) => {
  const data = req.data;
  const {
    name,
    description,
    date,
    members,
    totalBudget,
    placesVisited,
    totalTripDays,
    guidesOpted,
  } = req.body;
  const membersObj = [],
    placesVisitedObj = [],
    guidesOptedObj = [];

  try {
    const dateObj = new Date(date);
    await members.map(async (m) => membersObj.push(await new ObjectId(m._id)));
    await placesVisited.map(async (p) =>
      placesVisitedObj.push(await new ObjectId(p._id))
    );
    await guidesOpted.map(async (g) =>
      guidesOptedObj.push(await new ObjectId(g._id))
    );

    const user = await User.findOne({ mobile: data.mobile });

    const travelplan = await TravelPlan.create({
      name,
      description,
      date: dateObj,
      members: membersObj,
      totalBudget,
      placesVisited: placesVisitedObj,
      totalTripDays,
      guidesOpted: guidesOptedObj,
    });

    if (travelplan) {
      user.travelPlans.push(travelplan._id);
      await user.save();
      res.status(201).json({ ack: true, travelplan });
    } else throw new Error("Error creating plan");
  } catch (err) {
    console.log("Error while creating plan: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const updatePlan = async (req, res, next) => {
  const {
    _id,
    name,
    description,
    date,
    members,
    totalBudget,
    placesVisited,
    totalTripDays,
    guidesOpted,
  } = req.body;

  const membersObj = [],
    placesVisitedObj = [],
    guidesOptedObj = [];

  try {
    const dateObj = new Date(date);
    await members.map(async (m) => membersObj.push(await new ObjectId(m._id)));
    await placesVisited.map(async (p) =>
      placesVisitedObj.push(await new ObjectId(p._id))
    );
    await guidesOpted.map(async (g) =>
      guidesOptedObj.push(await new ObjectId(g._id))
    );

    const travelplan = await TravelPlan.findByIdAndUpdate(
      _id,
      {
        $set: {
          name,
          description,
          date: dateObj,
          members: membersObj,
          totalBudget,
          placesVisited: placesVisitedObj,
          totalTripDays,
          guidesOpted: guidesOptedObj,
        },
      },
      { new: true }
    );

    if (travelplan) {
      res.status(200).json({ ack: true, travelplan });
    } else throw new Error("Error updating plan");
  } catch (err) {
    console.log("Error while updating plan: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const deletePlan = async (req, res, next) => {
  const data = req.data;
  const { _id } = req.body;

  try {
    const user = await User.findOne({ mobile: data.mobile });

    const travelplan = await TravelPlan.findByIdAndDelete(_id, { new: true });

    if (travelplan) {
      user.travelPlans = user.travelPlans?.filter((t) => t._id !== _id);
      await user.save();

      res.status(200).json({ ack: true, travelplan });
    } else throw new Error("Error deleting plan");
  } catch (err) {
    console.log("Error while deleting plan: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const searchMember = async (req, res, next) => {
  const { search } = req.body;

  try {
    const searchRegex = new RegExp(search, "i");
    let members;
    if (search) {
      members = await User.find({ name: { $regex: searchRegex } });
    } else {
      members = await User.find({});
    }
    res.status(200).json({ ack: true, members });
  } catch (err) {
    console.log("Error while fetching members: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const searchPlace = async (req, res, next) => {
  const { search } = req.body;

  try {
    const searchRegex = new RegExp(search, "i");
    let places;
    if (search) {
      places = await Place.find({ name: { $regex: searchRegex } });
    } else {
      places = await Place.find({});
    }
    res.status(200).json({ ack: true, places });
  } catch (err) {
    console.log("Error while fetching members: ", err);
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

module.exports = {
  fetchAllPlan,
  fetchSpecificPlan,
  createPlan,
  updatePlan,
  deletePlan,
  searchMember,
  searchPlace,
  searchGuide,
};
