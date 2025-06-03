const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static('public')); // Serves index.html, results.html //

mongoose.connect('mongodb://localhost:27017/surveyDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const surveySchema = new mongoose.Schema({
  fullname: String,
  email: String,
  dob: String,
  contact: String,
  food: [String],
  movies: Number,
  radio: Number,
  "eat,out": Number,
  TV: Number
});
const Survey = mongoose.model('Survey', surveySchema);

// Handle survey submission from index.html
app.post('/submit', async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    await newSurvey.save();
    res.json({ message: "Survey submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Provide all survey results to results.html
app.get('/results', async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: Serve index.html at root if needed
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});