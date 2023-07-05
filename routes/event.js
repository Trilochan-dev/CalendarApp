const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
} = require("../controller/event");
const verify = require("../middlewire/verifyToken");
const verifyOwnershp = require("../middlewire/verifyOwnership");
const { sendMail } = require("../controller/sendMail");

router.post("/create", verify, createEvent);
router.get("/get-events", verify, getAllEvents);
router.patch("/:id/update", verify, verifyOwnershp, updateEvent);
router.delete("/:id/delete", verify, verifyOwnershp, deleteEvent);
router.get("/trigger-mail", sendMail);

module.exports = router;
