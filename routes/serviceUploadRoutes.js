// routes/serviceUploadRoutes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Ensure upload dir exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'services');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer: keep images in memory so we can process with sharp (no temp files)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ok = /image\/(png|jpe?g|webp|gif)/i.test(file.mimetype);
  cb(ok ? null : new Error('Only image files are allowed'), ok);
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024, files: 10 } // 4MB per image
});

// Convert every image to 1200x800 WebP (3:2), quality 82
const processToWebp = async (buffer, outPath) => {
  await sharp(buffer)
    .rotate()
    .resize(1200, 800, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82, effort: 4 })
    .toFile(outPath);
};

router.post(
  '/upload',
  protect,
  authorizeRoles('service_provider', 'admin'),
  upload.array('images', 10),
  async (req, res) => {
    try {
      const files = req.files || [];
      if (files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

      const paths = [];
      for (const f of files) {
        const base = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        const outName = `${base}.webp`;
        const outPath = path.join(uploadDir, outName);
        await processToWebp(f.buffer, outPath);
        paths.push(`/uploads/services/${outName}`); // relative path returned to client
      }
      return res.json({ message: 'Uploaded', paths });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
