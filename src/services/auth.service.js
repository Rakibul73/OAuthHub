const userService = require("./user.service");

class AuthService {
    constructor() {
        this.userService = userService;
    }

    async handleGoogleAuth(profile) {
        try {
            const existingUser = await this.userService.findOne({
                "google.id": profile.id,
            });

            if (existingUser) return existingUser;

            return await this.userService.create({
                google: {
                    id: profile.id,
                    email: profile.emails[0].value,
                },
                name: profile.displayName,
            });
        } catch (error) {
            throw error;
        }
    }

    async handleFacebookAuth(profile) {
        try {
            const existingUser = await this.userService.findOne({
                "facebook.id": profile.id,
            });

            if (existingUser) return existingUser;

            return await this.userService.create({
                facebook: {
                    id: profile.id,
                    email: profile.emails[0].value,
                },
                name: profile.displayName,
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService();
