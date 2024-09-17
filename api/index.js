// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());

const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = 'feedbackDB';
let db;

// MongoDB connection (inside each API handler)
MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to Database');
  })
  .catch(error => console.error(error));

// Main route
app.get('/', (req, res) => {
  const ans = 'hi api';
  res.json({ data: ans, message: 'new new api' });
});

// Feedback submission route
app.post('/submit-feedback', async (req, res) => {
  const feedbackCollection = db.collection('feedbacks');
  const feedback = req.body;

  try {
    const result = await feedbackCollection.insertOne(feedback);
    res.json({ success: true, data: result });
  } catch (error) {
    res.json({ success: false, error });
  }
});

// Export the app to be used as a Vercel serverless function
module.exports = app;
