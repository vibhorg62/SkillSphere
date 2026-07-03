import multer from 'multer';

// Use memory storage so we can upload directly to Cloudinary via stream
const storage = multer.memoryStorage();

// Middleware for image uploads (thumbnails)
export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware for video uploads (lessons)
export const uploadVideo = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit for videos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Middleware for lesson uploads (video + optional thumbnail)
export const uploadLessonFiles = multer({
  storage,
  limits: { fileSize: 105 * 1024 * 1024 }, // 105 MB total
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for field ' + file.fieldname), false);
    }
  }
});

