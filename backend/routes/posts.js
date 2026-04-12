const express = require('express');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get posts by topic
router.get('/topic/:slug', async (req, res) => {
  try {
    const Topic = require('../models/Topic');
    const topic = await Topic.findOne({ slug: req.params.slug });
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await Post.find({ topic: topic._id, published: true })
      .populate('author', 'name avatar')
      .populate('topic', 'name slug emoji color')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Post.countDocuments({ topic: topic._id, published: true });
    res.json({ posts, total, pages: Math.ceil(total / limit), page });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const posts = await Post.find({ published: true })
      .populate('author', 'name avatar')
      .populate('topic', 'name slug emoji color')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Post.countDocuments({ published: true });
    res.json({ posts, total, pages: Math.ceil(total / limit), page });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true })
      .populate('author', 'name avatar bio')
      .populate('topic', 'name slug emoji color');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.views += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, summary, content, coverImage, topic, tags } = req.body;
    const post = await Post.create({
      title, summary, content, coverImage, topic, tags,
      author: req.user._id,
      published: req.user.role === 'admin' || req.user.role === 'author'
    });
    await post.populate(['author', 'topic']);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    const { title, summary, content, coverImage, topic, tags } = req.body;
    const updated = await Post.findByIdAndUpdate(req.params.id, { title, summary, content, coverImage, topic, tags }, { new: true })
      .populate('author', 'name avatar').populate('topic', 'name slug emoji color');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed demo posts (admin only)
router.post('/seed/demo', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  try {
    const Topic = require('../models/Topic');
    const User = require('../models/User');
    const topics = await Topic.find();
    if (!topics.length) return res.status(400).json({ message: 'Seed topics first' });
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(400).json({ message: 'No admin user found. Create an admin account first.' });
    const demoPosts = [
      { title: 'Hidden Gems of Tuscany', summary: 'Discover the secret villages and vineyards of one of Italy\'s most beautiful regions.', content: 'Tuscany is famous for its rolling hills, Renaissance art, and world-class wine...', coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', topic: topics.find(t=>t.slug==='tourism')?._id },
      { title: 'Tokyo on a Budget', summary: 'Explore Japan\'s capital without breaking the bank with these insider tips.', content: 'Tokyo might seem expensive, but there are countless ways to experience this incredible city affordably...', coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', topic: topics.find(t=>t.slug==='tourism')?._id },
      { title: 'Building REST APIs with Node.js', summary: 'A comprehensive guide to creating robust and scalable REST APIs using Express and MongoDB.', content: 'REST APIs are the backbone of modern web applications...', coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', topic: topics.find(t=>t.slug==='coding')?._id },
      { title: 'React Hooks Deep Dive', summary: 'Master useState, useEffect, useContext and custom hooks with real-world examples.', content: 'React Hooks revolutionized how we write components...', coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', topic: topics.find(t=>t.slug==='coding')?._id },
      { title: 'The Perfect Carbonara', summary: 'Learn the authentic Roman technique for silky carbonara without cream.', content: 'True carbonara is a study in simplicity and technique...', coverImage: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800', topic: topics.find(t=>t.slug==='cooking')?._id },
      { title: 'Sourdough from Scratch', summary: 'Create your own starter and bake bakery-quality sourdough bread at home.', content: 'Making sourdough is both an art and a science...', coverImage: 'https://images.unsplash.com/photo-1585478259715-4d3039bcd966?w=800', topic: topics.find(t=>t.slug==='cooking')?._id },
    ];
    await Post.deleteMany({});
    const posts = await Post.insertMany(demoPosts.filter(p => p.topic).map(p => ({...p, author: admin._id, published: true, slug: p.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-') + '-' + Date.now() + Math.random()})));
    res.json({ message: `${posts.length} posts seeded`, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
