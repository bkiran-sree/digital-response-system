const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const url = `https://gnews.io/api/v4/search?q=disaster OR earthquake OR flood OR wildfire OR heavy rains &lang=en&max=5&token=4d28e1f98db3a7cb8d1e6c3b43a53220`;

    const response = await axios.get(url);
    res.json({ articles: response.data.articles });
  } catch (err) {
    console.error('Error fetching news via API:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
