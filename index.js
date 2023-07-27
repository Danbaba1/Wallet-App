// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 3000;


// Middleware to parse JSON
app.use(express.json());

// index.js

// Authorization middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, 'your_secret_key_here', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      req.user = user;
      next();
    });
  };

  app.use(authenticateJWT);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
