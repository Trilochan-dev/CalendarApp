const Event = require("../model/event");

const verifyOwnerShip = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;
    // Check if the event belongs to the authenticated user
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    // If the user is the owner, proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = verifyOwnerShip;
