// controllers/serviceController.js
const Service = require('../models/Service');
const User = require('../models/userModel');

// helper: require approved service provider
const ensureApprovedProvider = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) return { ok: false, msg: 'User not found' };
  if (user.role !== 'service_provider') {
    return { ok: false, msg: 'Only service providers can create/edit services' };
  }
  const status = user.serviceProviderProfile?.approvalStatus;
  if (status !== 'approved') {
    return { ok: false, msg: 'Provider profile not approved yet' };
  }
  return { ok: true, user };
};

// Provider creates a service (must be approved provider)
exports.createService = async (req, res) => {
  try {
    const check = await ensureApprovedProvider(req.user._id);
    if (!check.ok) return res.status(403).json({ message: check.msg });

    const {
      title,
      category,
      description,
      price,
      currency,
      location,
    } = req.body;

    if (!title || !description || price === undefined) {
      return res
        .status(400)
        .json({ message: 'title, description and price are required' });
    }

    // images can come from multer (preferred) or from body (fallback)
    const uploaded = (req.files || []).map((f) => `/uploads/services/${f.filename}`);
    const bodyImages = Array.isArray(req.body.images) ? req.body.images : [];
    const images = [...uploaded, ...bodyImages];

    const service = await Service.create({
      provider: req.user._id,
      title,
      category,
      description,
      price: Number(price),
      currency: currency || 'JPY',
      images,
      location,
      // keep your behavior: created services are approved by default
      adminStatus: 'approved',
    });

    res.status(201).json({ message: 'Service created', service });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Provider updates own service OR admin can update anything
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const isOwner = service.provider.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const patch = [
      'title',
      'category',
      'description',
      'price',
      'currency',
      'location',
      'isActive',
      'adminStatus', // allow admin to flip if you ever use pending flow
    ];

    patch.forEach((k) => {
      if (req.body[k] !== undefined) {
        service[k] = k === 'price' ? Number(req.body[k]) : req.body[k];
      }
    });

    // append any newly uploaded images
    if (req.files && req.files.length > 0) {
      const newImgs = req.files.map((f) => `/uploads/services/${f.filename}`);
      service.images = [...service.images, ...newImgs];
    }

    // if images provided as complete replacement in body
    if (Array.isArray(req.body.images)) {
      service.images = req.body.images;
    }

    await service.save();
    res.json({ message: 'Service updated', service });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Provider deletes own service OR admin can delete
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const isOwner = service.provider.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: list services (approved + active)
exports.listServices = async (req, res) => {
  try {
    const { q, category, provider, page = 1, limit = 12 } = req.query;

    const filter = { isActive: true, adminStatus: 'approved' };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (provider) filter.provider = provider;

    const p = Math.max(parseInt(page) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit) || 12, 1), 50);
    const skip = (p - 1) * l;

    const [items, total] = await Promise.all([
      Service.find(filter)
        .populate('provider', 'name email role serviceProviderProfile.approvalStatus')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(l),
      Service.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: {
        page: p,
        pages: Math.ceil(total / l) || 1,
        total,
        limit: l,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: service detail (only if active)
exports.getService = async (req, res) => {
  try {
    const s = await Service.findById(req.params.id).populate(
      'provider',
      'name email role serviceProviderProfile.approvalStatus'
    );
    if (!s || !s.isActive || s.adminStatus !== 'approved') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: set status (active/inactive OR moderation in future)
exports.setServiceStatus = async (req, res) => {
  try {
    const { isActive, adminStatus } = req.body; // optional fields

    const s = await Service.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Service not found' });

    if (isActive !== undefined) s.isActive = !!isActive;
    if (adminStatus !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(adminStatus)) {
        return res.status(400).json({ message: 'Invalid adminStatus' });
      }
      s.adminStatus = adminStatus;
    }

    await s.save();
    res.json({ message: 'Service status updated', service: s });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Provider-only: list my own services (optionally include inactive / unapproved)
exports.listMyServices = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 12, includeInactive = '1', includeUnapproved = '1' } = req.query;

    const filter = { provider: req.user._id };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;

    // Only restrict if flags are not set
    if (String(includeInactive) !== '1') filter.isActive = true;
    if (String(includeUnapproved) !== '1') filter.adminStatus = 'approved';

    const p = Math.max(parseInt(page) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit) || 12, 1), 50);
    const skip = (p - 1) * l;

    const [items, total] = await Promise.all([
      Service.find(filter)
        .populate('provider', 'name email role serviceProviderProfile.approvalStatus')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(l),
      Service.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: {
        page: p,
        pages: Math.ceil(total / l) || 1,
        total,
        limit: l,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Provider/Admin: get a single service even if inactive/unapproved, but only if owner or admin
exports.getServiceOwner = async (req, res) => {
  try {
    const s = await Service.findById(req.params.id).populate(
      'provider',
      'name email role serviceProviderProfile.approvalStatus'
    );
    if (!s) return res.status(404).json({ message: 'Service not found' });

    const isOwner = s.provider._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

