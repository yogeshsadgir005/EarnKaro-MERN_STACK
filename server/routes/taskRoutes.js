const express = require('express');
const router = express.Router();
const {
  getTasks,
  getSliderTasks,
  getLeaderboard,
  getCategorizedTasks,
  completeTask,
  createTask,
  updateTaskStatus,
  getAllTasks,               // ✅ new
  toggleTaskField,           // ✅ new
  deleteTaskById,// ✅ new
  updateTaskById             
} = require('../controllers/taskController');

const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware'); // ✅ admin check

// 📌 Public Routes
router.get('/', getTasks); // Will return only featured tasks
router.get('/slider-tasks', getSliderTasks);
router.get('/categorized', getCategorizedTasks);
router.get('/leaderboard', getLeaderboard);

// 🔐 Authenticated User
router.post('/complete', protect, completeTask);

// 🔐 Admin Routes
router.post('/add', protect, isAdmin, createTask);
router.post('/update-task-status', protect, isAdmin, updateTaskStatus);
router.get('/all', protect, isAdmin, getAllTasks);                     // ✅ Fetch all tasks
router.put('/toggle/:taskId', protect, isAdmin, toggleTaskField);     // ✅ Toggle isFeatured/isSlider
router.delete('/:taskId', protect, isAdmin, deleteTaskById);          // ✅ Delete task by ID
router.put('/update/:taskId', protect, isAdmin, updateTaskById);

module.exports = router;
