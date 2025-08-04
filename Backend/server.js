const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const cors = require('cors');

// Enable CORS for cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB using connection URI from .env
// Removed deprecated useNewUrlParser and useUnifiedTopology options
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydb')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('DB connection error:', err));

// Import route files
const userRoutes = require('./routes/userRoutes');
const panditRoutes = require('./routes/panditRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const poojaRoutes = require('./routes/poojaRoutes');
const locationRoutes = require('./routes/locationRoutes');



// Use API routes with proper prefixes
app.use('/api/users', userRoutes);
app.use('/api/pandits', panditRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/poojas', poojaRoutes);
app.use('/api/locations', locationRoutes);

// Default route to test if API is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler for invalid JSON in requests
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
});

// Start backend server on specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
