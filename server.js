const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 4001;


// Middleware to serve static files and parse request body
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'feedbackDB';
let db;

// Connect to MongoDB
MongoClient.connect(mongoUrl)
    .then(client => {
        console.log('Connected to Database');
        db = client.db(dbName);
    })
    .catch(error => console.error(error));

    app.get('/', (req, res)=>{
        const ans = "hi api";
        return res.json({
        data : ans,
        message: "new new api"
        })
    })
// POST route to handle feedback submission
app.post('/submit-feedback', (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
