const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Make sure this matches your MySQL username
  password: 'T@h@october31', // Put your actual MySQL password here
  database: 'code_arena'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to Code Arena database!');
});

module.exports = connection;