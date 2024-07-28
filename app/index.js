const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const config = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fcnodedb'
};

const connection = mysql.createConnection(config);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  const name = `User ${Date.now()}`;
  connection.query(`INSERT INTO people(name) VALUES('${name}')`, (err) => {
    if (err) {
      console.error('Error inserting into the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query('SELECT name FROM people', (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const namesList = results.map(row => `<li>${row.name}</li>`).join('');
      res.send(`<h1>Full Cycle Rocks!</h1><ul>${namesList}</ul>`);
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
