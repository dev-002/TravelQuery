const User = require("../models/user");

const getUser = async (req, res, next) => {
  const data = req.data;
  try {
    const user = await User.findOne({ name: data.name });
    if (user) {
      return res.status(201).json({ ack: true, user });
    } else return res.status(404).json({ ack: false, msg: "No user exist" });
  } catch (err) {
    return res.status(500).json({ ack: false, msg: err });
  }
};

const updateUser = async (req, res, next) => {
  const username = req.params.username;
  const newdata = req.body.update;
  try {
    const user = await User.findOne({ name: username });
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(user._id, {
        $set: { ...newdata },
      });
      if (updatedUser?.acknowledgement) {
        return res.status(200).json({ ack: true, updatedUser });
      } else throw new Error("Error while updating User");
    } else return res.status(404).json({ ack: false, msg: "No user exist" });
  } catch (err) {
    return res.status(500).json({ ack: false, msg: err });
  }
};

module.exports = { getUser, updateUser };
