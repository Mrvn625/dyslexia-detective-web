
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with your database later)
let testResults = [];
let userProfiles = [];

// Routes
// Get all test results
app.get('/api/test-results', (req, res) => {
  res.json(testResults);
});

// Get test results for a specific user
app.get('/api/test-results/:userId', (req, res) => {
  const userResults = testResults.filter(result => result.userId === req.params.userId);
  res.json(userResults);
});

// Save test result
app.post('/api/test-results', (req, res) => {
  const newResult = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  testResults.push(newResult);
  res.status(201).json(newResult);
});

// User profile endpoints
app.get('/api/users/:userId', (req, res) => {
  const user = userProfiles.find(profile => profile.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  userProfiles.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:userId', (req, res) => {
  const userIndex = userProfiles.findIndex(profile => profile.id === req.params.userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  userProfiles[userIndex] = {
    ...userProfiles[userIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json(userProfiles[userIndex]);
});

// Generate recommendations based on test results
app.get('/api/recommendations/:userId', (req, res) => {
  const userResults = testResults.filter(result => result.userId === req.params.userId);
  
  if (userResults.length === 0) {
    return res.status(404).json({ message: 'No test results found for this user' });
  }
  
  // This is a simplified version - will be expanded with actual recommendation logic
  const recommendations = generateRecommendations(userResults);
  res.json({ recommendations });
});

// Helper function (move to a separate file later)
function generateRecommendations(results) {
  const recommendations = [];
  
  // Basic recommendation logic (improve this with your actual algorithm)
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  
  if (averageScore < 40) {
    recommendations.push("High risk of dyslexia. Professional evaluation recommended.");
    recommendations.push("Consider specialized literacy intervention programs.");
  } else if (averageScore < 70) {
    recommendations.push("Moderate risk indicators present. Further assessment may be beneficial.");
    recommendations.push("Regular monitoring of reading and writing development is recommended.");
  } else {
    recommendations.push("Low risk profile based on current assessments.");
    recommendations.push("Continue regular educational activities with periodic monitoring.");
  }
  
  // Add specific recommendations based on test types
  results.forEach(result => {
    if (result.testId === "working-memory" && result.score < 50) {
      recommendations.push("Working memory exercises may be beneficial.");
    }
    if (result.testId === "phonemic-awareness" && result.score < 50) {
      recommendations.push("Phonological awareness training is recommended.");
    }
  });
  
  return recommendations;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
