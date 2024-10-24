import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'; // Correct import
import dotenv from 'dotenv';
import ApiRoutes from './routes/api.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Proper naming convention for body-parser

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ruleDB', {

})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Route for the homepage
app.get('/', (req, res) => {
    res.json({ msg: "Hello World" });
});

// API routes
app.use('/api', ApiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
