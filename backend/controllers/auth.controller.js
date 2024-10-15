const express = require('express');

const auth = express.Router();

auth.get('/login', (req, res) => {
    res.json({ message: 'Login route' });
}); 

auth.post('/logout', (req, res) => {
    res.json({ message: 'Logout route' });
});

module.exports = auth;