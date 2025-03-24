
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for handwriting images

// In-memory storage (replace with your database later)
let testResults = [];
let userProfiles = [];
let handwritingResults = [];
let checklistResults = [];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
// Get all test results
app.get('/api/test-results', (req, res) => {
  try {
    res.json(testResults);
  } catch (error) {
    console.error('Error fetching all test results:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get test results for a specific user
app.get('/api/test-results/:userId', (req, res) => {
  try {
    const userResults = testResults.filter(result => result.userId === req.params.userId);
    res.json(userResults);
  } catch (error) {
    console.error(`Error fetching test results for user ${req.params.userId}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save test result
app.post('/api/test-results', (req, res) => {
  try {
    const newResult = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    testResults.push(newResult);
    res.status(201).json(newResult);
  } catch (error) {
    console.error('Error saving test result:', error);
    res.status(500).json({ message: 'Error saving test result', error: error.message });
  }
});

// User profile endpoints
app.get('/api/users/:userId', (req, res) => {
  try {
    const user = userProfiles.find(profile => profile.id === req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(`Error fetching user ${req.params.userId}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const newUser = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    // Calculate age group based on age
    if (newUser.age) {
      if (newUser.age < 6) {
        newUser.ageGroup = "preschool";
      } else if (newUser.age < 13) {
        newUser.ageGroup = "school";
      } else if (newUser.age < 18) {
        newUser.ageGroup = "adolescent";
      } else if (newUser.age < 60) {
        newUser.ageGroup = "adult";
      } else {
        newUser.ageGroup = "senior";
      }
    }
    
    userProfiles.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

app.put('/api/users/:userId', (req, res) => {
  try {
    const userIndex = userProfiles.findIndex(profile => profile.id === req.params.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updatedUser = {
      ...userProfiles[userIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // Recalculate age group if age changed
    if (req.body.age) {
      if (req.body.age < 6) {
        updatedUser.ageGroup = "preschool";
      } else if (req.body.age < 13) {
        updatedUser.ageGroup = "school";
      } else if (req.body.age < 18) {
        updatedUser.ageGroup = "adolescent";
      } else if (req.body.age < 60) {
        updatedUser.ageGroup = "adult";
      } else {
        updatedUser.ageGroup = "senior";
      }
    }
    
    userProfiles[userIndex] = updatedUser;
    
    res.json(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${req.params.userId}:`, error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Validate profile existence
app.get('/api/validate-profile/:userId', (req, res) => {
  try {
    const user = userProfiles.find(profile => profile.id === req.params.userId);
    res.json({ 
      exists: !!user,
      profileCompleted: !!user,
      userAge: user ? user.age : null,
      ageGroup: user ? user.ageGroup : null
    });
  } catch (error) {
    console.error(`Error validating profile for user ${req.params.userId}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Handwriting analysis endpoints
app.post('/api/handwriting-analysis', (req, res) => {
  try {
    const newAnalysis = {
      id: uuidv4(),
      ...req.body,
      completedAt: new Date().toISOString()
    };
    
    handwritingResults.push(newAnalysis);
    res.status(201).json(newAnalysis);
  } catch (error) {
    console.error('Error saving handwriting analysis:', error);
    res.status(500).json({ message: 'Error saving analysis', error: error.message });
  }
});

app.get('/api/handwriting-analysis/:userId', (req, res) => {
  try {
    const userResults = handwritingResults.filter(result => result.userId === req.params.userId);
    if (userResults.length === 0) {
      return res.status(404).json({ message: 'No handwriting analysis found for this user' });
    }
    
    // Return the most recent analysis
    const mostRecent = userResults.sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )[0];
    
    res.json(mostRecent);
  } catch (error) {
    console.error(`Error fetching handwriting analysis for user ${req.params.userId}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Checklist results
app.post('/api/checklist-results', (req, res) => {
  try {
    const newResult = {
      id: uuidv4(),
      ...req.body,
      completedAt: new Date().toISOString()
    };
    
    checklistResults.push(newResult);
    res.status(201).json(newResult);
  } catch (error) {
    console.error('Error saving checklist result:', error);
    res.status(500).json({ message: 'Error saving checklist result', error: error.message });
  }
});

app.get('/api/checklist-results/:userId', (req, res) => {
  try {
    const userResults = checklistResults.filter(result => result.userId === req.params.userId);
    res.json(userResults);
  } catch (error) {
    console.error(`Error fetching checklist results for user ${req.params.userId}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Integration point for ML models
// This is where you would add your CNN and SVM model endpoints
app.post('/api/ml/analyze-handwriting', (req, res) => {
  try {
    // Here you would:
    // 1. Extract the handwriting image data from req.body
    // 2. Preprocess the image for your CNN model
    // 3. Load your CNN model (implementation depends on how you've trained it)
    // 4. Run the model on the preprocessed image
    // 5. Process the results and send them back
    
    // For now, we'll return a mock response
    res.json({
      id: uuidv4(),
      userId: req.body.userId,
      handwritingFeatures: {
        lineSpacing: 0.78,
        letterSpacing: 0.65,
        letterConsistency: 0.72,
        letterRotation: 0.45,
        pressure: 0.82
      },
      dyslexiaIndicators: {
        score: 0.68,
        confidence: 0.75,
        severity: "moderate"
      },
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing handwriting with ML:', error);
    res.status(500).json({ message: 'Error analyzing handwriting', error: error.message });
  }
});

app.post('/api/ml/analyze-test-results', (req, res) => {
  try {
    // Here you would:
    // 1. Extract the test data from req.body
    // 2. Preprocess the data for your SVM model
    // 3. Load your SVM model
    // 4. Run the model on the preprocessed data
    // 5. Process the results and send them back
    
    // Mock response
    res.json({
      id: uuidv4(),
      userId: req.body.userId,
      analysisResult: {
        dyslexiaProbability: 0.72,
        confidence: 0.85,
        riskLevel: "medium-high",
        significantFactors: [
          "working-memory",
          "phonemic-awareness"
        ]
      },
      recommendations: [
        "Consider a formal evaluation with a learning specialist",
        "Practice phonemic awareness exercises daily",
        "Use working memory enhancement techniques"
      ],
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing test results with ML:', error);
    res.status(500).json({ message: 'Error analyzing test results', error: error.message });
  }
});

// Generate recommendations based on test results
app.get('/api/recommendations/:userId', (req, res) => {
  try {
    const userResults = testResults.filter(result => result.userId === req.params.userId);
    
    if (userResults.length === 0) {
      return res.status(404).json({ message: 'No test results found for this user' });
    }
    
    // This is a simplified version - will be expanded with actual recommendation logic
    const recommendations = generateRecommendations(userResults);
    res.json({ recommendations });
  } catch (error) {
    console.error(`Error generating recommendations for user ${req.params.userId}:`, error);
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
});

// Helper function to generate recommendations based on test results
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

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
  });
});

console.log(`ML Model Integration Points:
- POST /api/ml/analyze-handwriting: Add your CNN model here for handwriting analysis
- POST /api/ml/analyze-test-results: Add your SVM model here for test result analysis
- The cognitive test components also have comments indicating where model integration points are
`);
