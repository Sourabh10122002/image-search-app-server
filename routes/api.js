const express = require('express');
const axios = require('axios');
const Search = require('../models/Search');
const authRequired = require('../middleware/authRequired');
const router = express.Router();

router.get('/top-searches', async (req, res) => {
    try {
        const results = await Search.aggregate([
            { $group: { _id: '$term', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        res.json(results.map(r => ({ term: r._id, count: r.count })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/search', authRequired, async (req, res) => {
    try {
        const { term } = req.body;
        if (!term) return res.status(400).json({ error: 'term required' });

        await Search.create({ userId: req.user._id, term });

        const per_page = 30;
        const uresp = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query: term, per_page },
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
        });

        const images = uresp.data.results.map(img => ({
            id: img.id,
            alt: img.alt_description,
            small: img.urls.small,
            regular: img.urls.regular,
            width: img.width,
            height: img.height,
            user: img.user && { name: img.user.name, link: img.user.links.html }
        }));

        res.json({ term, total: uresp.data.total, results: images });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to search' });
    }
});

router.get('/history', authRequired, async (req, res) => {
    try {
        const history = await Search.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(history.map(h => ({ term: h.term, timestamp: h.timestamp })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;