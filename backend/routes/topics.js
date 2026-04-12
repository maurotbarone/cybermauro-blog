const express = require('express');
const Topic = require('../models/Topic');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all topics
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create topic (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, emoji, color, order } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const topic = await Topic.create({ name, slug, description, emoji, color, order });
    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed topics (admin only)
router.post('/seed', adminAuth, async (req, res) => {
  try {
    await Topic.deleteMany({});
    const topics = await Topic.insertMany([
      { name: 'Tourism', slug: 'tourism', description: 'Travel and exploration', emoji: '✈️', color: '#0ea5e9', order: 0 },
      { name: 'Coding', slug: 'coding', description: 'Programming and tech', emoji: '💻', color: '#8b5cf6', order: 1 },
      { name: 'Cooking', slug: 'cooking', description: 'Recipes and food culture', emoji: '🍳', color: '#f59e0b', order: 2 },
      { name: 'Fitness', slug: 'fitness', description: 'Health and wellness', emoji: '💪', color: '#10b981', order: 3 },
      { name: 'Books', slug: 'books', description: 'Literature and reading', emoji: '📚', color: '#ec4899', order: 4 }
    ]);
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
