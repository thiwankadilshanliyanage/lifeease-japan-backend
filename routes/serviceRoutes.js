// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createService,
  updateService,
  deleteService,
  listServices,
  getService,
  setServiceStatus, // admin
  listMyServices,   // <-- NEW
  getServiceOwner,  // <-- NEW
} = require('../controllers/serviceController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Multer for service images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/services/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// -------- Provider/Owner routes (must come before :id) --------
router.get(
  '/mine',
  protect,
  authorizeRoles('service_provider', 'admin'),
  listMyServices
);
router.get(
  '/:id/owner',
  protect,
  getServiceOwner
);

// -------- Public --------
router.get('/', listServices);
router.get('/:id', getService);

// -------- Provider-only (must be approved; controller checks) --------
router.post('/', protect, upload.array('images', 6), createService);

// -------- Owner (provider) or admin --------
router.put('/:id', protect, upload.array('images', 6), updateService);
router.delete('/:id', protect, deleteService);

// -------- Admin: toggle active/inactive or moderate --------
router.put('/:id/status', protect, authorizeRoles('admin'), setServiceStatus);

module.exports = router;
