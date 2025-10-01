// routes/serviceUploadRoutes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Ensure upload dir exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'services');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ok = /image\/(png|jpe?g|webp|gif)/i.test(file.mimetype);
  cb(ok ? null : new Error('Only image files are allowed'), ok);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 6 * 1024 * 1024 } }); // 6MB each

// POST /api/services/upload  (multiple images)
router.post(
  '/upload',
  protect,
  authorizeRoles('service_provider', 'admin'),
  upload.array('images', 10), // "images" must match frontend field
  async (req, res) => {
    try {
      const paths = (req.files || []).map((f) => `/uploads/services/${path.basename(f.path)}`);
      return res.json({ message: 'Uploaded', paths });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
