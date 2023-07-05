const express = require("express");
const dotenv = require("dotenv");
const MongoDB = require("./database/connection");
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const cors = require("cors");
const { startCron } = require("./cronjob");

const router = express.Router();
MongoDB();
dotenv.config();
const PORT = process.env.PORT;
const task = "start";

const app = express();
app.use(express.json());
app.use(cors());

//Configure routes
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);

app.use("/", router);

startCron(task);

app.listen(PORT, () => {
  console.log(`Server running on : http://localhost:${PORT}`);
});
