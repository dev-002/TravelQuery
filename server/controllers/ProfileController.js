const User = require("../models/user");
const Place = require("../models/place");
const Guide = require("../models/guide");

const getUser = async (req, res, next) => {
  const data = req.data;
  let user;
  try {
    if (data.role == 2) {
      user = await User.findOne({ mobile: data.mobile });
    } else user = await Guide.findOne({ mobile: data.mobile });
    if (user) {
      return res.status(200).json({ ack: true, user });
    } else return res.status(404).json({ ack: false, msg: "No user exist" });
  } catch (err) {
    return res.status(500).json({ ack: false, msg: err });
  }
};

const updateUser = async (req, res, next) => {
  const data = req.data;
  const newData = req.body;
  try {
    console.log(req.body);
    let user, updatedUser;
    if (data.role === 2) {
      user = await User.findOne({ mobile: data.mobile });
      if (user) {
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            $set: newData,
          },
          { new: true }
        );
      } else {
        user = await Guide.findOne({ mobile: data.mobile });
        if (user) {
          updatedUser = await Guide.findByIdAndUpdate(
            user._id,
            {
              $set: newData,
            },
            { new: true }
          );
        }
      }

      console.log(user);
      if (updatedUser) {
        return res.status(200).json({ ack: true, updatedUser });
      } else throw new Error("Error while updating User");
    } else return res.status(404).json({ ack: false, msg: "No user exist" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ack: false, msg: err });
  }
};

const fetchWishlist = async (req, res, next) => {
  const userData = req.data;

  try {
    if (userData) {
      const user = await User.findOne({ mobile: userData.mobile }).populate(
        "wishlist"
      );
      if (user) {
        return res.status(200).json({ ack: true, wishlist: user.wishlist });
      } else throw new Error("No User Found");
    }
  } catch (err) {
    console.log("Error in wishlist", err);
    return res.status(500).json({ ack: false, err });
  }
};

const toggleWishlist = async (req, res, next) => {
  const userData = req.data;
  const { place_id } = req.body;

  try {
    if (userData) {
      let user = await User.findOne({ mobile: userData.mobile });
      if (user) {
        let place = await Place.findById(place_id);
        if (place) {
          if (user.wishlist.includes(place_id)) {
            user = await User.findByIdAndUpdate(
              user._id,
              {
                $pull: { wishlist: place_id },
              },
              { new: true }
            );
          } else {
            user = await User.findByIdAndUpdate(
              user._id,
              {
                $push: { wishlist: place_id },
              },
              { new: true }
            );
          }
          if (user) {
            return res.status(200).json({ ack: true, user });
          } else throw new Error("Error in wishlist");
        } else throw new Error("No Place Found");
      } else throw new Error("No User Found");
    }
  } catch (err) {
    console.log("Error in wishlist", err);
    return res.status(500).json({ ack: false, err });
  }
};

const checkWishlist = async (req, res, next) => {
  const userData = req.data;
  const { place_id } = req.body;

  try {
    const user = await User.findOne({ mobile: userData.mobile });
    let status = await user.wishlist.includes(place_id);
    return res.status(200).json({ ack: true, status });
  } catch (err) {
    console.log("Error while checking wishlist");
    return res.status(500).json({ ack: false, err });
  }
};

module.exports = {
  getUser,
  updateUser,
  toggleWishlist,
  fetchWishlist,
  checkWishlist,
};
