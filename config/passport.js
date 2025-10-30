const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const u = await User.findById(id);
        done(null, u);
    } catch (err) {
        done(err);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_ROOT || 'http://localhost:4000'}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ provider: 'google', providerId: profile.id });
        if (!user) {
            user = await User.create({
                provider: 'google',
                providerId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value
            });
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_ROOT || 'http://localhost:4000'}/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ provider: 'github', providerId: profile.id });
        if (!user) {
            user = await User.create({
                provider: 'github',
                providerId: profile.id,
                displayName: profile.displayName || profile.username,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value
            });
        }
        done(null, user);
    } catch (err) {
        console.log('GitHub strategy error:', err);
        done(err);
    }
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_ROOT || 'http://localhost:4000'}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ provider: 'facebook', providerId: profile.id });
        if (!user) {
            user = await User.create({
                provider: 'facebook',
                providerId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value
            });
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
}));