const db = require('./db');

const questions = [
  { 
    title: 'Python Basics', track: 'Beginner', 
    question: 'What does len() return for an empty list?', 
    option_a: '0', option_b: '1', option_c: 'null', option_d: 'error', 
    correct_answer: 'option_a' 
  },
  { 
    title: 'Functions & Scope', track: 'Intermediate', 
    question: 'What is a lambda function in Python?', 
    option_a: 'A constant', option_b: 'An anonymous function', option_c: 'A loop', option_d: 'A class', 
    correct_answer: 'option_b' 
  }
];

questions.forEach(q => {
  // This syntax automatically matches the keys in 'q' to the column names in your table
  db.query('INSERT INTO quizzes SET ?', q, (err) => {
    if (err) console.error('Error inserting:', err);
    else console.log('Successfully inserted question!');
  });
});