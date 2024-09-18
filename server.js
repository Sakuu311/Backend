const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

// Middleware to serve static files and parse request body
app.use(express.static('public'));
app.use(bodyParser.json());

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'feedbackDB';
let db;

// Connect to MongoDB
MongoClient.connect(mongoUrl)
    .then(client => {
        console.log('Connected to Database');
        db = client.db(dbName);

        // Define routes only after connection is successful

        // GET route for home
        app.get('/', (req, res) => {
            const ans = "hi api";
            return res.json({
                data: ans,
                message: "new new api"
            });
        });

        // POST route to handle feedback submission
        app.post('/submit-feedback', (req, res) => {
            if (!db) {
                return res.status(503).json({ success: false, message: 'Database not connected' });
            }
            const feedbackCollection = db.collection('feedbacks');
            const feedbackData = {
                name: req.body.name,
                email: req.body.email,
                feedback: req.body.feedback,
                date: new Date()
            };

            feedbackCollection.insertOne(feedbackData)
                .then(result => {
                    res.json({ success: true });
                })
                .catch(error => {
                    console.error(error);
                    res.json({ success: false });
                });
        });

        // GET route to retrieve all feedbacks
        app.get('/get_feedback', (req, res) => {
            if (!db) {
                return res.status(503).json({ success: false, message: 'Database not connected' });
            }
            const feedbackCollection = db.collection('feedbacks');

            feedbackCollection.find().toArray()
                .then(feedbacks => {
                    res.json(feedbacks);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ success: false, message: 'Error fetching feedback' });
                });
        });

        // Start the server after defining the routes
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch(error => console.error('Failed to connect to Database', error));
