// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const userController = require('../controllers/userController');
// const multer = require('multer');
// const path = require('path');
// const { protect } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/videos');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 6 * 1024 * 1024 } // Limit to 6MB
// }).single('video');

// // Routes
// router.post('/register', userController.registerUser);
// router.post('/login', userController.loginUser);
// router.get('/details', authMiddleware, userController.getUserDetails);
// router.put('/details', authMiddleware, upload, userController.updateUserDetails);

// // New route to get all users and their videos
// router.get('/videos', userController.getAllUsersWithVideos);
// router.post('/upload-video', protect, upload.single('video'), uploadUserVideo);

// module.exports = router;


const express = require('express');
const { registerUser, loginUser, getUserDetails, updateUserDetails, uploadUserVideo ,getUsersWithVideos } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 6000000 }, // limit file size to 6MB
    fileFilter(req, file, cb) {
        if (file.mimetype === 'video/mp4') {
            cb(null, true);
        } else {
            cb(new Error('Only .mp4 format allowed!'));
        }
    }
});

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/details', protect, getUserDetails);
router.put('/update', protect, updateUserDetails);
router.post('/upload-video', protect, upload.array('videos'), uploadUserVideo);
router.get('/users-with-videos', protect, getUsersWithVideos);
router.get('/videos', userController.getAllUsersWithVideos);

module.exports = router;
