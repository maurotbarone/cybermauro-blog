const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Topic = require('./models/Topic');
const Post = require('./models/Post');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Post.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@blog.com',
    password: 'password123',
    role: 'admin',
    bio: 'Blog administrator and main author'
  });

  const author = await User.create({
    name: 'Jane Doe',
    email: 'jane@blog.com',
    password: 'password123',
    role: 'author',
    bio: 'Travel enthusiast and coding aficionado'
  });

  // Create categories
  const categories = await Category.insertMany([
    { name: 'Tourism', slug: 'tourism', description: 'Travel guides and adventures', icon: '✈️', color: '#f59e0b', order: 1 },
    { name: 'Coding', slug: 'coding', description: 'Programming tutorials and tech insights', icon: '💻', color: '#6366f1', order: 2 },
    { name: 'Cooking', slug: 'cooking', description: 'Recipes and culinary delights', icon: '🍳', color: '#10b981', order: 3 },
    { name: 'Lifestyle', slug: 'lifestyle', description: 'Everyday life and wellness', icon: '🌿', color: '#ec4899', order: 4 },
  ]);

  // Create topics (same as categories for now)
  const topics = await Topic.insertMany([
    { name: 'Tourism', slug: 'tourism', description: 'Travel guides and adventures', emoji: '✈️', color: '#f59e0b', order: 1 },
    { name: 'Coding', slug: 'coding', description: 'Programming tutorials and tech insights', emoji: '💻', color: '#6366f1', order: 2 },
    { name: 'Cooking', slug: 'cooking', description: 'Recipes and culinary delights', emoji: '🍳', color: '#10b981', order: 3 },
    { name: 'Lifestyle', slug: 'lifestyle', description: 'Everyday life and wellness', emoji: '🌿', color: '#ec4899', order: 4 },
  ]);

  // Create sample posts
  const posts = [
    {
      title: 'Exploring the Hidden Gems of Tuscany',
      slug: 'exploring-tuscany-' + Date.now(),
      summary: 'Discover the rolling hills, medieval villages, and world-class cuisine that make Tuscany one of Italy\'s most beloved regions.',
      content: `<h2>The Magic of Tuscany</h2><p>Tuscany is a region in central Italy renowned for its landscapes, traditions, history, artistic legacy, and influence on high culture. The regional capital is Florence. Tuscany is known for its wines, including Chianti, Brunello di Montalcino, and Morellino di Scansano.</p><h2>Must-Visit Places</h2><p>From the iconic Duomo in Florence to the winding streets of Siena, Tuscany offers endless exploration. The Val d'Orcia valley provides some of the most photographed landscapes in the world, with its cypress-lined roads and rolling green hills.</p><p>Don't miss the charming hilltop town of San Gimignano, known for its medieval towers, or the coastal beauty of Cinque Terre, just a short drive from the Tuscan border.</p><h2>Local Cuisine</h2><p>No trip to Tuscany is complete without indulging in the local cuisine. Try ribollita, a hearty bread soup, bistecca alla fiorentina (Florentine steak), and finish with a scoop of authentic Florentine gelato.</p>`,
      author: author._id,
      topic: topics[0]._id,
      coverImage: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800',
      tags: ['tuscany', 'italy', 'travel', 'europe'],
      published: true
    },
    {
      title: 'Building Your First React App in 2024',
      slug: 'react-app-2024-' + (Date.now() + 1),
      summary: 'A step-by-step guide to building modern React applications with hooks, context, and best practices for beginners and intermediate developers.',
      content: `<h2>Getting Started with React</h2><p>React is a JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular frontend frameworks in the world. In this guide, we'll walk through the process of creating your first React application from scratch.</p><h2>Setting Up Your Environment</h2><p>First, make sure you have Node.js installed on your machine. Then, you can create a new React app using Create React App or Vite (recommended for faster builds):</p><pre><code>npm create vite@latest my-app -- --template react-ts</code></pre><h2>Understanding Components</h2><p>React is all about components. Think of them as building blocks for your UI. Each component can have its own state and props, making it reusable and composable.</p><h2>State Management with Hooks</h2><p>React Hooks revolutionized how we write React components. useState, useEffect, and useContext are the most commonly used hooks that you'll need to master.</p>`,
      author: admin._id,
      topic: topics[1]._id,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      tags: ['react', 'javascript', 'frontend', 'tutorial'],
      published: true
    },
    {
      title: 'The Perfect Homemade Pasta: An Italian Grandmother\'s Secret',
      slug: 'perfect-homemade-pasta-' + (Date.now() + 2),
      summary: 'Learn the art of making fresh pasta from scratch with simple ingredients and techniques passed down through generations.',
      content: `<h2>The Art of Pasta Making</h2><p>There is nothing quite like the taste of freshly made pasta. Unlike its dried counterpart, fresh pasta has a tender texture and rich flavor that pairs beautifully with simple, high-quality sauces.</p><h2>Ingredients</h2><p>For 4 servings: 300g 00 flour, 3 large eggs (at room temperature), 1 tablespoon olive oil, pinch of salt.</p><h2>The Process</h2><p>Create a mound of flour on a clean surface. Make a well in the center and add the eggs, olive oil, and salt. Using a fork, gradually incorporate the flour from the inner edges of the well. Once it becomes too thick for a fork, use your hands to bring the dough together.</p><p>Knead the dough for 10 minutes until smooth and elastic. Wrap in plastic and rest for 30 minutes. Then roll out and cut into your desired shape.</p>`,
      author: author._id,
      topic: topics[2]._id,
      coverImage: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800',
      tags: ['pasta', 'italian', 'recipe', 'homemade'],
      published: true
    },
    {
      title: 'Tokyo: A Guide to the World\'s Most Fascinating City',
      slug: 'tokyo-travel-guide-' + (Date.now() + 3),
      summary: 'From ancient temples to futuristic skyscrapers, Tokyo is a city of endless contrasts. Here\'s everything you need to know for your visit.',
      content: `<h2>Welcome to Tokyo</h2><p>Tokyo, Japan's capital, is a sprawling metropolis that seamlessly blends the ultra-modern with the traditional. With a population of over 13 million people, it's one of the world's most populous cities, yet remarkably safe, clean, and efficient.</p><h2>Getting Around</h2><p>Tokyo has one of the world's most extensive and efficient public transportation systems. The Tokyo Metro and JR lines can take you anywhere in the city. Consider getting a Suica card for easy tap-and-go payment.</p><h2>Neighborhoods to Explore</h2><p>Shibuya is famous for its scramble crossing and youth fashion. Shinjuku offers incredible nightlife and the peaceful Shinjuku Gyoen gardens. Asakusa takes you back in time with its traditional temples and street food.</p>`,
      author: admin._id,
      topic: topics[0]._id,
      coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      tags: ['tokyo', 'japan', 'travel', 'asia'],
      published: true
    },
    {
      title: 'Mastering CSS Grid: The Complete Guide',
      slug: 'css-grid-complete-guide-' + (Date.now() + 4),
      summary: 'CSS Grid is one of the most powerful layout tools in modern web development. Learn how to use it effectively with practical examples.',
      content: `<h2>What is CSS Grid?</h2><p>CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay content out in rows and columns, and has many features that make building complex layouts straightforward.</p><h2>Basic Grid Concepts</h2><p>To create a grid container, set display: grid on an element. The direct children of that element automatically become grid items. You can then define columns and rows using grid-template-columns and grid-template-rows.</p><pre><code>.container { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }</code></pre><h2>Advanced Techniques</h2><p>The minmax() function allows you to create flexible grids that adapt to their content. The auto-fill and auto-fit keywords create responsive grids without media queries.</p>`,
      author: author._id,
      topic: topics[1]._id,
      coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
      tags: ['css', 'web-design', 'layout', 'tutorial'],
      published: true
    },
    {
      title: 'Sourdough Bread: Your Ultimate Beginner\'s Guide',
      slug: 'sourdough-beginners-guide-' + (Date.now() + 5),
      summary: 'Sourdough baking can seem intimidating, but with patience and practice, anyone can create beautiful, delicious loaves at home.',
      content: `<h2>The Magic of Sourdough</h2><p>Sourdough bread is made by the fermentation of dough using naturally occurring lactobacilli and wild yeast. The lactic acid produced by the bacteria gives sourdough its distinctive sour taste, and improves its keeping quality.</p><h2>Creating Your Starter</h2><p>A sourdough starter is a mixture of flour and water that captures wild yeast from the environment. Mix 50g whole wheat flour with 50g water in a jar. Stir well, cover loosely, and leave at room temperature. Feed daily by discarding half and adding fresh flour and water.</p><h2>Baking Your First Loaf</h2><p>Once your starter is active (bubbly and doubling in size after feeding), you're ready to bake. Mix flour, water, salt, and starter. Allow to bulk ferment for 4-6 hours, shape, and refrigerate overnight. Bake in a Dutch oven at 500°F for 20 minutes covered, then 20 minutes uncovered.</p>`,
      author: admin._id,
      topic: topics[2]._id,
      coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
      tags: ['sourdough', 'bread', 'baking', 'beginner'],
      published: true
    },
    {
      title: 'The Rise of Sustainable Tourism',
      slug: 'sustainable-tourism-rise-' + Date.now(),
      summary: 'Sustainable tourism is transforming the travel industry, offering ways to explore the world while protecting our planet and supporting local communities.',
      content: `<h2>What is Sustainable Tourism?</h2><p>Sustainable tourism focuses on responsible travel that minimizes negative impacts on the environment and local communities while maximizing economic benefits. It involves traveling in ways that preserve natural resources, respect cultural heritage, and support local economies.</p><h2>Why It Matters</h2><p>Traditional tourism can strain resources, contribute to pollution, and disrupt local cultures. Sustainable tourism aims to balance the needs of travelers with the protection of destinations for future generations.</p><h2>Practical Tips for Travelers</h2><p>Choose eco-friendly accommodations, support local businesses, reduce waste, and learn about the cultures you're visiting. Small changes in travel habits can make a big difference in creating positive impacts.</p>`,
      author: author._id,
      topic: topics[0]._id,
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      tags: ['sustainable', 'tourism', 'travel', 'environment'],
      published: true
    }
  ];

  await Post.insertMany(posts);

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin: admin@blog.com / password123');
  console.log('👤 Author: jane@blog.com / password123');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
