const Task = require('../models/Task');
const User = require('../models/User');


exports.getLeaderboard = async (req, res) => {
  const users = await User.find().sort({ points: -1 }).limit(10);
  res.json(users);
};

exports.getCategorizedTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    const categorized = {
      apps: tasks.filter(t => t.category === 'apps'),
      games: tasks.filter(t => t.category === 'games'),
      skills: tasks.filter(t => t.category === 'skills')
    };

    res.json(categorized);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

exports.completeTask = async (req, res) => {
  const { taskId } = req.body;

  try {
    const task = await Task.findById(taskId);
    const user = await User.findById(req.user._id);

    if (!task || !user) return res.status(404).json({ message: 'Task or user not found' });

    const existingReward = user.rewards.find(r => r.title === task.title);

    if (existingReward) {
      if (existingReward.status === 'pending' || existingReward.status === 'completed') {
        return res.status(400).json({ message: 'Task already started or completed' });
      }

      if (existingReward.status === 'failed') {
        existingReward.status = 'pending';
        existingReward.credited = false;
        existingReward.createdAt = new Date(); 
        await user.save();
        return res.status(200).json({ message: 'Retry allowed. Task set to pending again.' });
      }
    }

    user.rewards.push({
      title: task.title,
      amount: task.reward,
      status: 'pending',
      credited: false,
      createdAt: new Date()
    });

    await user.save();
    res.status(200).json({ message: 'Task started and marked as pending' });

  } catch (err) {
    console.error("Start task error:", err.message);
    res.status(500).json({ message: "Failed to start task", error: err.message });
  }
};


exports.updateTaskStatus = async (req, res) => {
  const { userId, rewardIndex, newStatus } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !user.rewards[rewardIndex]) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const reward = user.rewards[rewardIndex];

    if (reward.status === 'completed' && reward.credited) {
      return res.status(400).json({ message: 'Already completed and credited' });
    }

    reward.status = newStatus;

    if (newStatus === 'completed' && !reward.credited) {
      reward.credited = true;
      user.points += reward.amount;
    }

    await user.save();
    res.status(200).json({ message: `Task status updated to ${newStatus}` });
  } catch (err) {
    console.error('Error updating reward:', err.message);
    res.status(500).json({ message: 'Failed to update reward', error: err.message });
  }
};


exports.createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json({ message: "Task created", task: newTask });
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
};



exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isFeatured: true });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching featured tasks' });
  }
};

exports.getSliderTasks = async (req, res) => {
  try {
    const sliderTasks = await Task.find({ isSlider: true });
    res.json(sliderTasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching slider tasks' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all tasks', error: err.message });
  }
};

exports.toggleTaskField = async (req, res) => {
  const { taskId } = req.params;
  const { field } = req.body; 

  if (!['isFeatured', 'isSlider'].includes(field)) {
    return res.status(400).json({ message: 'Invalid field to toggle' });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task[field] = !task[field];
    await task.save();

    res.status(200).json({ message: `${field} toggled`, updatedTask: task });
  } catch (err) {
    res.status(500).json({ message: 'Error toggling field', error: err.message });
  }
};

exports.deleteTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const deleted = await Task.findByIdAndDelete(taskId);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};


exports.updateTaskById = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};
