const router = require("express").Router();
const passport = require("passport");
const axios = require("axios");
const User = require("../models/User");

// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        console.log(
            "Google OAuth callback successful - redirecting to home page"
        );
        res.redirect("/api");
    }
);

// Facebook OAuth routes
router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
        console.log(
            "Facebook OAuth callback successful - redirecting to home page"
        );
        res.redirect("/api");
    }
);

// LinkedIn OAuth routes
router.get("/linkedin", (req, res) => {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
    // const state = Math.random().toString(36).substring(7);

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email`;
    // const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email&state=${state}`;

    res.redirect(linkedInAuthUrl);
});

// Configuration variables
const config = {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    redirectUri: process.env.LINKEDIN_REDIRECT_URI,
    routeToClient: process.env.CLIENT_URL,
};

router.get("/linkedin/callback", async (req, res) => {
    try {
        // const { code, state } = req.query;
        // const { email } = JSON.parse(Buffer.from(state, "base64").toString());

        const { code } = req.query;

        console.log("LinkedIn callback received");
        console.log("code = ", code);

        // Get LinkedIn access token
        const tokens = await getAccessTokenLinkedin(code);

        // Get user profile
        const userProfile = await getUserProfileLinkedin(tokens.access_token);

        // Save user and generate tokens
        await saveUserAndGenerateTokens(userProfile);

        // Redirect to frontend
        res.redirect("/api");
    } catch (error) {
        console.error("LinkedIn callback error:", error);
        res.status(500).json({
            message: `Internal Server Error. ERROR: ${error}`,
            error,
        });
    }
});

async function getAccessTokenLinkedin(code) {
    const url = "https://www.linkedin.com/oauth/v2/accessToken";
    const params = {
        grant_type: "authorization_code",
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
    };

    try {
        const response = await axios.post(url, params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data;
    } catch (error) {
        console.error("getAccessTokenLinkedin error:", error);
        throw error;
    }
}

async function getUserProfileLinkedin(accessToken) {
    const url = "https://api.linkedin.com/v2/userinfo";
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };

    const response = await axios.get(url, { headers });
    return response.data;
}

async function saveUserAndGenerateTokens(userProfile) {
    const newUser = await new User({
        linkedin: {
            id: userProfile.sub,
            email: userProfile.email,
        },
        name: userProfile.name,
    }).save();
}

module.exports = router;
