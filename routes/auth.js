const express = require('express');
const passport = require('passport');
require('../config/passport');
const router = express.Router();

const CLIENT_URL = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

router.get('/status', (req, res) => {
    console.log(req.user);
    if (req.user) {
        res.json({ ok: true, user: req.user });
    } else {
        res.json({ ok: false });
    }
});

router.get('/debug', (req, res) => {
    res.json({
        session: req.session,
        user: req.user,
    });
});

router.get('/logout', (req, res) => {
    req.logout(() => { });
    req.session = null;
    res.json({ ok: true });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/login` }), (req, res) => {
    res.redirect(`${CLIENT_URL}/auth/success`);
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: `${CLIENT_URL}/login` }), (req, res) => {
    console.log('GitHub callback:', req.user);
    res.redirect(`${CLIENT_URL}/auth/success`);
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${CLIENT_URL}/login` }), (req, res) => {
    res.redirect(`${CLIENT_URL}/auth/success`);
});

router.post('/logout', (req, res) => {
    req.logout(() => { });
    req.session = null;
    res.json({ ok: true });
});

module.exports = router;