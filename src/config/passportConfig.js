const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const authService = require("../services/auth.service");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err));
});

// Facebook Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            scope: ["email", "public_profile"],
            profileFields: ["id", "displayName", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await authService.handleFacebookAuth(profile);
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
