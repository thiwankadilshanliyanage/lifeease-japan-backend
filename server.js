const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const serviceUploadRoutes = require('./routes/serviceUploadRoutes'); 

dotenv.config();
connectDB();

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Static Folders ----------
// Avatars specifically
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

// General uploads (service images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Routes ----------
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/services', serviceUploadRoutes);

// ---------- Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
