const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/users', require('./api/user'));
app.use('/api/auth', require('./api/auth'));
app.use('/api/session', require('./api/session'));
app.use('/api/sentence', require('./api/sentence'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
