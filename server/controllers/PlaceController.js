const Place = require("../models/place");

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
      console.log("Deletd Place: ", place);
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

  console.log(search);
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

module.exports = {
  fetchPlace,
  addPlace,
  updatePlace,
  deletePlace,
  searchPlace,
};
