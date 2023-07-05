const Event = require('../model/event');
const User = require('../model/user');

const createEvent = async (req, res) => {
    const { title, dateTime, timezone } = req.body;
    const userId = req.userId;

    try {
        const event = await Event.create({ title, dateTime, timezone, user: userId });

        // Update the user's events array
        await User.findByIdAndUpdate(userId, { $push: { events: event._id } });

        res.status(201).json({ success: true, data: event });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getAllEvents = async (req, res) => {
    const userId = req.userId;

    try {
        const events = await User.findById(userId)
            .populate('events');

        return res.json(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}


const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, dateTime, timezone } = req.body;

        // Find the event by ID and update its title and date
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { title, dateTime, timezone },
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

        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent }