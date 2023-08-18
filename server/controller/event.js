const Event = require("../model/event");
const User = require("../model/user");
const moment = require("moment");

const createEvent = async (req, res) => {
  const { title, date, timezone, start_time, duration } = req.body;
  const userId = req.userId;
  const today = moment().startOf("day");
  const givenDate = moment(date).startOf("day");

  const isBeforeToday = givenDate.isBefore(today);
  if (isBeforeToday) {
    return res.status(500).json({ message: "Event can't be create in past" });
  }
  try {
    const startTime = moment(start_time, "HH:mm:ss"); // Replace with your start time
    // Calculate the end time
    const endTime = startTime.clone().add(duration, "minutes");

    const event = await Event.create({
      title,
      date,
      timezone,
      user: userId,
      start_time,
      duration,
      end_time: endTime.format("HH:mm:ss"),
    });

    // Update the user's events array
    await User.findByIdAndUpdate(userId, { $push: { events: event._id } });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while creating event" });
  }
};
const getAllEvents = async (req, res) => {
  const userId = req.userId;

  try {
    const events = await User.findById(userId)
      .select("-password -createdAt -updatedAt")
      .populate("events");
    return res.json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, date, timezone, start_time, duration } = req.body;

    const startTime = moment(start_time, "HH:mm:ss"); // Replace with your start time
    // Calculate the end time
    const endTime = startTime.clone().add(duration, "minutes");

    // Find the event by ID and update its title and date
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        date,
        timezone,
        start_time,
        duration,
        end_time: endTime.format("HH:mm:ss"),
      },
      { new: true }
    );

    res.status(200).json({ success: true, event: updatedEvent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    // Find and delete the event
    await Event.findByIdAndDelete(eventId);

    // Remove the event ID from the user's events array
    await User.findByIdAndUpdate(userId, { $pull: { events: eventId } });

    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent };
