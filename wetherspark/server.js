const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('website'));


let projectData = {};

// GET route to return projectData
app.get('/all', (req, res) => {
  console.log("Project data:", projectData);
  res.send(projectData);
});

// POST route to add data to projectData
app.post('/add', (req, res) => {
  console.log("Data received:", req.body);
  projectData = {
    temperature: req.body.temperature,
    date: req.body.date,
    userResponse: req.body.userResponse
  };
  res.send({ message: 'Data received' });
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
