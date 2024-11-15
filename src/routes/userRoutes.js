const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");

// Get user profile
router.get("/profile/:id", async (req, res) => {
    try {
        const user = await userService.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update user profile
router.put("/profile/:id", async (req, res) => {
    try {
        const updatedUser = await userService.updateProfile(
            req.params.id,
            req.body
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get paginated users
router.get("/users", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || { createdAt: -1 };

        const users = await userService.findPaginated(
            {},
            { page, limit, sort }
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
