const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
require('dotenv').config();

const cors = require('cors');
const app = express();

// Enable CORS for all origins (for testing / local development)
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] // allow only these
}));


// Optional: parse JSON requests
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
