require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./src/models/user.model");
const express = require("express");
const { createUser } = require("./src/repository/user.repository");
const { createQuestion } = require("./src/repository/question.repository");
const { createAnswer } = require("./src/repository/answer.repository");
const authMiddleware = require("./src/middlewares/authmiddleware");

const userRoutes = require("./src/routes/user.route");
const questionRoutes = require("./src/routes/question.route");
const answerRoutes = require("./src/routes/answer.route");
const subplaceRoutes = require("./src/routes/subplace.router");
const publicRoutes = require("./src/routes/public.route");
const placeRoutes = require("./src/routes/place.route");

if (!process.env.API_KEY) {
  console.log("API_KEY is missing!");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(authMiddleware);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Metods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

if (!process.env.mongoURL) {
  console.log("MongoURL not defined");
  return -1;
}

app.use("/public", publicRoutes);
app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/subplace", subplaceRoutes);
app.use("/place", placeRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.mongoURL);
    console.log("Connected!");
  } catch (error) {
    console.log("Cannot connect to mongo: ", error.message);
    return -1;
  }
};

start();

app.listen(process.env.PORT, () => {
  console.log("Server beží na porte 3000");
});
