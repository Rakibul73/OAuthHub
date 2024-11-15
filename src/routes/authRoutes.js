const router = require("express").Router();
const passport = require("passport");
const linkedInService = require("../services/linkedin.service");

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
    const authUrl = linkedInService.getAuthUrl();
    res.redirect(authUrl);
});

router.get("/linkedin/callback", async (req, res) => {
    try {
        const { code } = req.query;

        // Get LinkedIn access token
        const tokens = await linkedInService.getAccessToken(code);

        // Get user profile
        const userProfile = await linkedInService.getUserProfile(
            tokens.access_token
        );

        // Save user and generate tokens
        await linkedInService.handleAuth(userProfile);

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

module.exports = router;
