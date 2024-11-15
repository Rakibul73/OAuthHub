const express = require("express");
const router = express.Router();

router.get("/status", (req, res) => {
    res.json({ status: "API is running", timestamp: new Date() });
});

router.get("/", (req, res) => {
    res.json({ status: "Welcome to OauthHub", timestamp: new Date() });
});

module.exports = router;
