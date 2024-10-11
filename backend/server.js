const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// parse JSON requests
app.use(express.json());

app.use(cors());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

console.log("Its running");

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});