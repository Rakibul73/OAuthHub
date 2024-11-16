const axios = require("axios");
const userService = require("./user.service");

class FacebookService {
    constructor() {
        this.config = {
            appId: process.env.FACEBOOK_APP_ID,
            appSecret: process.env.FACEBOOK_APP_SECRET,
            callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
        };
        this.userService = userService;
    }

    getAuthUrl(state) {
        return `https://www.facebook.com/v21.0/dialog/oauth?client_id=${this.config.appId}&redirect_uri=${this.config.callbackUrl}&scope=email%2Cpublic_profile&state=${state}`;
    }

    async getAccessToken(code) {
        const url = "https://graph.facebook.com/v21.0/oauth/access_token";
        const params = {
            client_id: this.config.appId,
            redirect_uri: this.config.callbackUrl,
            client_secret: this.config.appSecret,
            code,
        };

        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            console.error("Facebook getAccessToken error:", error);
            throw error;
        }
    }

    async getUserProfile(accessToken) {
        const url = "https://graph.facebook.com/me";
        const params = {
            fields: "id,name,email",
            access_token: accessToken,
        };

        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            console.error("Facebook getUserProfile error:", error);
            throw error;
        }
    }

    async handleAuth(userProfile) {
        try {
            console.log(`userProfile : ${userProfile}`);
            // const existingUser = await this.userService.findOne({
            //     "facebook.id": userProfile.sub,
            // });

            // if (existingUser) return existingUser;

            // return await this.userService.create({
            //     facebook: {
            //         id: userProfile.sub,
            //         email: userProfile.email,
            //     },
            //     name: userProfile.name,
            // });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new FacebookService();
