const Guide = require("../models/guide");

const fetchAllGuide = async (req, res, next) => {
  try {
    const guides = await Guide.find();
    console.log(guides);
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
    if (guide) return res.status(200).json({ ack: true, guides });
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

module.exports = {
  fetchAllGuide,
  fetchSpecificGuide,
  updateGuide,
  deleteGuide,
};
