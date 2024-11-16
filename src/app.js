const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();
require("./config/passportConfig");

const app = express();

// Use CORS middleware
app.use(
    cors({
        origin: "https://localhost:3000", // Replace with your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
        credentials: true, // Allow credentials (if needed)
    })
);

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
