const axios = require("axios");
const userService = require("./user.service");

class GoogleService {
    constructor() {
        this.config = {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: process.env.GOOGLE_CALLBACK_URL,
        };
        this.userService = userService;
    }

    getAuthUrl(state) {
        return `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${this.config.redirectUri}&scope=profile%20email&state=${state}&client_id=${this.config.clientId}&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow`;
    }

    async getAccessToken(code) {
        const data = {
            code: code,
            client_id: this.client_id,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
            grant_type: "authorization_code",
        };
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            data
        );
        return tokenResponse.data;
    }

    async getUserInfo(accessToken) {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const userInfoResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            { headers }
        );
        return userInfoResponse.data;
    }

    async handleAuth(profile) {
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
    }
}

module.exports = new GoogleService();
