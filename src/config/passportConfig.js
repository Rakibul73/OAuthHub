const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err));
});

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({
                    "google.id": profile.id,
                });
                if (existingUser) return done(null, existingUser);

                const newUser = await new User({
                    google: {
                        id: profile.id,
                        email: profile.emails[0].value,
                    },
                    name: profile.displayName,
                }).save();
                done(null, newUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

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
                const existingUser = await User.findOne({
                    "facebook.id": profile.id,
                });
                if (existingUser) return done(null, existingUser);

                const newUser = await new User({
                    facebook: {
                        id: profile.id,
                        email: profile.emails[0].value,
                    },
                    name: profile.displayName,
                }).save();
                done(null, newUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
