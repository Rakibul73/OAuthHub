const axios = require("axios");
const userService = require("./user.service");

class LinkedInService {
    constructor() {
        this.config = {
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            redirectUri: process.env.LINKEDIN_REDIRECT_URI,
        };
        this.userService = userService;
    }

    getAuthUrl(state) {
        return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUri}&scope=openid%20profile%20email&state=${state}`;
    }

    async getAccessToken(code) {
        const url = "https://www.linkedin.com/oauth/v2/accessToken";
        const params = {
            grant_type: "authorization_code",
            code,
            redirect_uri: this.config.redirectUri,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
        };

        try {
            const response = await axios.post(url, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return response.data;
        } catch (error) {
            console.error("LinkedIn getAccessToken error:", error);
            throw error;
        }
    }

    async getUserProfile(accessToken) {
        const url = "https://api.linkedin.com/v2/userinfo";
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            console.error("LinkedIn getUserProfile error:", error);
            throw error;
        }
    }

    async handleAuth(userProfile) {
        try {
            const existingUser = await this.userService.findOne({
                "linkedin.id": userProfile.sub,
            });

            if (existingUser) return existingUser;

            return await this.userService.create({
                linkedin: {
                    id: userProfile.sub,
                    email: userProfile.email,
                },
                name: userProfile.name,
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LinkedInService();
