const router = require("express").Router();
const linkedInService = require("../services/linkedin.service");
const axios = require("axios");

// Google OAuth routes
router.get("/google", (req, res) => {
    const state = Buffer.from(JSON.stringify({ provider: "google" })).toString(
        "base64"
    );

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=profile%20email&state=${state}&client_id=${process.env.GOOGLE_CLIENT_ID}&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow`;
    res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
    const { code } = req.query;
    console.log("Google OAuth callback successful - redirecting to home page");
    // Get LinkedIn access token
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

    const data = {
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
    };
    const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        data
    );
    console.log("tokenResponse = ", tokenResponse.data);

    const headers = {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
    };
    const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers }
    );

    const googleUserInfo = userInfoResponse.data;
    console.log(googleUserInfo);

    console.log("OK");
    res.json({
        accessToken: "asdasdsadds",
        refreshToken: "asdasdsadds",
        accessTokenExpireIn: 1000,
        refreshTokenExpireIn: 1000,
    });
});

// Facebook OAuth routes
router.get("/facebook", (req, res) => {
    const state = Buffer.from(
        JSON.stringify({ provider: "facebook" })
    ).toString("base64");

    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_CALLBACK_URL}&scope=email%2Cpublic_profile&state=${state}`;
    res.redirect(authUrl);
});

router.get("/facebook/callback", async (req, res) => {
    const { code } = req.query;
    console.log(`code ${code}`);
    // Step 1: Exchange code for access token
    const tokenResponse = await axios.get(
        "https://graph.facebook.com/v21.0/oauth/access_token",
        {
            params: {
                client_id: process.env.FACEBOOK_APP_ID,
                redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                code,
            },
        }
    );
    const { access_token } = tokenResponse.data;

    // Step 2: Use access token to fetch user profile
    const userResponse = await axios.get("https://graph.facebook.com/me", {
        params: {
            fields: "id,name,email",
            access_token,
        },
    });
    const user = userResponse.data;
    console.log(user);
    console.log(
        "Facebook OAuth callback successful - redirecting to home page"
    );
    console.log("OK");
    res.json({
        accessToken: "asdasdsadds",
        refreshToken: "asdasdsadds",
        accessTokenExpireIn: 1000,
        refreshTokenExpireIn: 1000,
    });
});

// LinkedIn OAuth routes
router.get("/linkedin", (req, res) => {
    const state = Buffer.from(
        JSON.stringify({ provider: "linkedin" })
    ).toString("base64");
    const authUrl = linkedInService.getAuthUrl(state);
    res.redirect(authUrl);
});

router.get("/linkedin/callback", async (req, res) => {
    try {
        const { code, state } = req.query;
        const { provider } = JSON.parse(
            Buffer.from(state, "base64").toString()
        ); // Decode state to get email
        console.log(`provider : ${provider}`);

        // Get LinkedIn access token
        const tokens = await linkedInService.getAccessToken(code);

        // Get user profile
        const userProfile = await linkedInService.getUserProfile(
            tokens.access_token
        );

        // Save user and generate tokens
        await linkedInService.handleAuth(userProfile);

        // Redirect to frontend
        console.log("OK");
        res.json({
            accessToken: "asdasdsadds",
            refreshToken: "asdasdsadds",
            accessTokenExpireIn: 1000,
            refreshTokenExpireIn: 1000,
        });
    } catch (error) {
        console.error("LinkedIn callback error:", error);
        res.status(500).json({
            message: `Internal Server Error. ERROR: ${error}`,
            error,
        });
    }
});

module.exports = router;
