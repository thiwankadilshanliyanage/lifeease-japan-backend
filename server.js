const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Routes
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const serviceUploadRoutes = require('./routes/serviceUploadRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ---------- Middleware ----------

// CORS configuration (LOCAL + FUTURE FRONTEND)
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      process.env.CLIENT_URL
    ],
    credentials: true
  })
);

// Body parser
app.use(express.json());

// ---------- Static Folders ----------

// Avatar uploads
app.use(
  '/uploads/avatars',
  express.static(path.join(__dirname, 'uploads/avatars'))
);

// Other uploads (services, etc.)
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ---------- Routes ----------

app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/services', serviceUploadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);

// ---------- Health Check (OPTIONAL BUT RECOMMENDED) ----------
app.get('/', (req, res) => {
  res.send('🚀 LifeEase Backend is running');
});

// ---------- Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
