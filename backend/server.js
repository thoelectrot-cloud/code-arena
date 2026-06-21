const express = require('express');
const db = require('./db');
const app = express();

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
app.listen(3000, () => {
  console.log('Server running on port 3000');
});