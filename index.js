const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
require('dotenv').config();


const app = express();
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Welcome to the Tourism Mediation App');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
