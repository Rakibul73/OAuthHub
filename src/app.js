const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
require("./config/passportConfig");

const app = express();

app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log("Connected to MongoDB"));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/api", require("./routes/apiRoutes"));

module.exports = app;
