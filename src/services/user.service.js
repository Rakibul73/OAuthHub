const DatabaseService = require("./db.service");
const User = require("../models/User");

class UserService extends DatabaseService {
    constructor() {
        super(User);
    }

    // Add custom methods specific to users
    async findByEmail(email) {
        return this.findOne({ email });
    }

    async updateProfile(userId, profileData) {
        return this.updateOne(
            { _id: userId },
            { $set: profileData },
            { new: true }
        );
    }

    // Example of a more complex operation
    async findActiveUsers() {
        return this.find({ status: "active" });
    }
}

module.exports = new UserService();
