const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/all", async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
});

module.exports = router;
