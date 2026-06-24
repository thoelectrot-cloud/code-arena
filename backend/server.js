const express = require('express');
const cors = require('cors'); // Require it first
const app = express();        // Then initialize the app
const db = require('./db');
app.use(cors());
app.get('/api/quizzes', (req, res) => {
  const sql = 'SELECT * FROM quizzes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    // Return the list of questions
    res.status(200).json(results);
  });
});
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Middleware to parse JSON data
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Save to database
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Registration failed' });
      }
      res.status(201).json({ message: 'User registered successfully!' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error hashing password' });
  }
});
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ message: 'User not found' });

    // 2. Compare the password with the hash
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.status(200).json({ message: 'Login successful!', userId: user.id });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  });
});
app.post('/api/progress', (req, res) => {
  const { userId, quizId, isCompleted } = req.body;

  const sql = 'INSERT INTO user_progress (user_id, quiz_id, is_completed) VALUES (?, ?, ?)';
  db.query(sql, [userId, quizId, isCompleted], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save progress' });
    }
    res.status(201).json({ message: 'Progress saved!' });
  });
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});