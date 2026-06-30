const express = require('express');
const cors = require('cors');
const path = require('path');
const errorMiddleware = require('./middleware/errorMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const uploadMiddleware = require('./middleware/uploadMiddleware');
const s3Service = require('./services/s3Service');
const { sendSuccess, sendError } = require('./utils/responseHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local upload files statically
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// General File Upload endpoint (e.g. profile images, banners)
app.post('/api/upload', authMiddleware, uploadMiddleware.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded.', 400);
    }
    const fileUrl = await s3Service.uploadFile(req.file);
    return sendSuccess(res, { url: fileUrl }, 'File uploaded successfully.', 201);
  } catch (error) {
    next(error);
  }
});

// File Delete endpoint
app.delete('/api/upload/:fileKey', authMiddleware, async (req, res, next) => {
  try {
    const { fileKey } = req.params;
    const isUrl = fileKey.startsWith('http://') || fileKey.startsWith('https://');
    const targetUrl = isUrl ? fileKey : `/uploads/${fileKey}`;
    
    await s3Service.deleteFile(targetUrl);
    return sendSuccess(res, null, 'File deleted successfully.');
  } catch (error) {
    next(error);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Register Global Error Boundary
app.use(errorMiddleware);

module.exports = app;
