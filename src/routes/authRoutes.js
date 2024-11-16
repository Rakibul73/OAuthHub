const router = require("express").Router();
const googleService = require("../services/google.service");
const linkedInService = require("../services/linkedin.service");
const facebookService = require("../services/facebook.service");

// Google OAuth routes
router.get("/google", (req, res) => {
    const state = Buffer.from(JSON.stringify({ provider: "google" })).toString(
        "base64"
    );
    const authUrl = googleService.getAuthUrl(state);
    res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
    const { code, state } = req.query;

    try {
        const tokenResponse = await googleService.getAccessToken(code);
        const googleUserInfo = await googleService.getUserInfo(
            tokenResponse.access_token
        );
        await googleService.handleAuth(googleUserInfo);

        res.json({
            accessToken: "asdasdsadds",
            refreshToken: "asdasdsadds",
            accessTokenExpireIn: 1000,
            refreshTokenExpireIn: 1000,
        });
    } catch (error) {
        console.error("Google callback error:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
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
        const tokens = await linkedInService.getAccessToken(code);
        const userProfile = await linkedInService.getUserProfile(
            tokens.access_token
        );
        await linkedInService.handleAuth(userProfile);

        res.json({
            accessToken: "asdasdsadds",
            refreshToken: "asdasdsadds",
            accessTokenExpireIn: 1000,
            refreshTokenExpireIn: 1000,
        });
    } catch (error) {
        console.error("LinkedIn callback error:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// Facebook OAuth routes
router.get("/facebook", (req, res) => {
    const state = Buffer.from(
        JSON.stringify({ provider: "facebook" })
    ).toString("base64");
    const authUrl = facebookService.getAuthUrl(state);
    res.redirect(authUrl);
});

router.get("/facebook/callback", async (req, res) => {
    try {
        const { code, state } = req.query;
        const tokenResponse = await facebookService.getAccessToken(code);
        const { access_token } = tokenResponse;
        const userProfile = await facebookService.getUserProfile(access_token);
        await facebookService.handleAuth(userProfile);

        res.json({
            accessToken: "asdasdsadds",
            refreshToken: "asdasdsadds",
            accessTokenExpireIn: 1000,
            refreshTokenExpireIn: 1000,
        });
    } catch (error) {
        console.error("Facebook callback error:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

module.exports = router;
