const express = require('express');
const app = express();

app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Community test route
app.get('/api/community/test', (req, res) => {
  res.json({ message: 'Community API is accessible!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log('Try visiting: http://localhost:5000/test');
  console.log('Try visiting: http://localhost:5000/api/community/test');
}); 