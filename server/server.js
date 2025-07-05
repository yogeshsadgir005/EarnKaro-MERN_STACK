const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const payoutRoutes = require('./routes/payoutRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');


dotenv.config();
connectDB();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,}));


  app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/payout', payoutRoutes);
app.use('/api/admin', adminRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));