const Place = require("../models/place");
const User = require("../models/user");
const Guide = require("../models/guide");

const fetchPlace = async (req, res, next) => {
  const { _id } = req.headers;
  const { type } = req.body;

  try {
    let places;
    if (_id) {
      places = await Place.fincById(_id);
    } else if (type) places = await Place.find({ type });
    else places = await Place.find();

    if (places) {
      return res.status(200).json({ ack: true, places });
    } else return res.status(401).json({ ack: true, err: "No Place Found" });
  } catch (err) {
    console.log("Error in fetching Place: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const addPlace = async (req, res, next) => {
  const userData = req.data;

  try {
    if (userData) {
      const place = await Place.create({ ...req.body });
      if (place) {
        return res.status(201).json({ ack: true, places: place });
      } else throw new Error("while adding place");
    } else return res.status(401).json({ ack: true, err: "Not authorized" });
  } catch (err) {
    console.log("Error in fetching Place: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const updatePlace = async (req, res, next) => {
  const { _id } = req.headers;
  const updatedData = req.body;

  try {
    const place = await Place.findById(_id);
    if (place) {
      const update = await Place.findByIdAndUpdate(
        _id,
        { ...updatedData },
        { new: true }
      );
      if (update) {
        return res.status(200).json({ ack: true, places: update });
      } else throw new Error("error while updating");
    } else throw new Error("No Place found");
  } catch (err) {
    console.log("Error in fetching Place: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const deletePlace = async (req, res, next) => {
  const { _id } = req.headers;

  try {
    if (_id) {
      const place = await Place.findByIdAndDelete(_id);
      if (place) {
        return res.status(200).json({ ack: true });
      } else throw new Error("while deleting place");
    } else throw new Error("No Id Provided");
  } catch (err) {
    console.log("Error in fetching Place: ", err);
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

const addReview = async (req, res, next) => {
  const data = req.data;
  const { comment, rating, _id } = req.body;
  let user;

  try {
    if (data.role == 2) {
      user = await User.findOne({ mobile: data.mobile });
    } else user = await Guide.findOne({ mobile: data.mobile });

    if (user) {
      const place = await Place.findByIdAndUpdate(
        _id,
        { $push: { reviews: { comment, rating, user: user._id } } },
        { new: true }
      );

      if (place) {
        return res.status(200).json({ ack: true, place });
      }
    } else throw new Error("No user found");
  } catch (err) {
    console.log("Error while adding review: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const fetchReviews = async (req, res, next) => {
  const data = req.data;
  const id = req.headers?.id;

  let user;

  try {
    if (data.role == 2) {
      user = await User.findOne({ mobile: data.mobile });
    } else user = await Guide.findOne({ mobile: data.mobile });

    if (user) {
      const place = await Place.findByIdAndUpdate(
        _id,
        { $push: { reviews: { comment, rating, user: user._id } } },
        { new: true }
      );

      if (place) {
        return res.status(200).json({ ack: true, place });
      }
    } else throw new Error("No user found");
  } catch (err) {
    console.log("Error while adding review: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

module.exports = {
  fetchPlace,
  addPlace,
  updatePlace,
  deletePlace,
  searchPlace,
  addReview,
  fetchReviews,
};
