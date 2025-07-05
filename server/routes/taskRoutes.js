const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  getTasks,
  getSliderTasks,
  getLeaderboard,
  getCategorizedTasks,
  completeTask,
  createTask,
  updateTaskStatus,
  getAllTasks,              
  toggleTaskField,           
  deleteTaskById,
  updateTaskById             
} = require('../controllers/taskController');

const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware'); 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });


router.get('/', getTasks); 
router.get('/slider-tasks', getSliderTasks);
router.get('/categorized', getCategorizedTasks);
router.get('/leaderboard', getLeaderboard);


router.post('/complete', protect, completeTask);


router.post('/add', protect, isAdmin, upload.single('banner'), createTask);
router.post('/update-task-status', protect, isAdmin, updateTaskStatus);
router.get('/all', protect, isAdmin, getAllTasks);                     
router.put('/toggle/:taskId', protect, isAdmin, toggleTaskField);     
router.delete('/:taskId', protect, isAdmin, deleteTaskById);         
router.put('/update/:taskId', protect, isAdmin, upload.single('banner'), updateTaskById);


module.exports = router;
