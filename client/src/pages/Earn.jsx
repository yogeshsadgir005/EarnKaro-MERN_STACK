import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import {
  FaSpinner,
  FaArrowRight,
  FaGamepad,
  FaRocket,
  FaBrain,
  FaArrowLeft
} from 'react-icons/fa';

export default function Earn() {
  const [apps, setApps] = useState([]);
  const [games, setGames] = useState([]);
  const [skills, setSkills] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loadingTask, setLoadingTask] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, rewardsRes] = await Promise.all([
          axios.get('/tasks/categorized'),
          axios.get('/user/rewards', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setApps(tasksRes.data.apps);
        setGames(tasksRes.data.games);
        setSkills(tasksRes.data.skills);
        setRewards(rewardsRes.data.rewards || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const getTaskStatus = (taskTitle) => {
    const reward = rewards.find(r => r.title === taskTitle);
    return reward ? reward.status : null;
  };

  const handleTaskClick = async (task) => {
    const status = getTaskStatus(task.title);
    if (status === 'completed' || status === 'pending') return;

    const proceed = window.confirm(`Start "${task.title}"? You'll be redirected to the task page.`);
    if (!proceed) return;

    setLoadingTask(task._id);
    setRewards(prev => {
      const exists = prev.find(r => r.title === task.title);
      if (exists) {
        return prev.map(r => r.title === task.title ? { ...r, status: 'pending' } : r);
      } else {
        return [...prev, { title: task.title, status: 'pending' }];
      }
    });

    try {
      await axios.post('/tasks/complete', { taskId: task._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (task.link) {
        window.open(task.link, '_blank');
      } else {
        alert("No link found for this task.");
      }

      const updatedRewards = await axios.get('/user/rewards', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRewards(updatedRewards.data.rewards || []);
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoadingTask(null);
    }
  };


const renderButton = (task) => {
  const status = getTaskStatus(task.title);

  if (status === 'completed') {
    return (
      <button
        disabled
        className="mt-2 px-2 sm:px-4 py-2 text-xs sm:text-sm rounded font-medium bg-green-600 text-white flex items-center justify-center"
      >
        Completed
      </button>
    );
  } else if (status === 'pending') {
    return (
      <button
        disabled
        className="mt-2 px-2 sm:px-4 py-2 text-xs sm:text-sm rounded font-medium bg-yellow-500 text-white flex items-center justify-center"
      >
        Pending
      </button>
    );
  } else if (status === 'failed') {
    return (
      <button
        onClick={() => handleTaskClick(task)}
        disabled={loadingTask === task._id}
        className="mt-2 px-2 sm:px-4 py-2 text-xs sm:text-sm rounded font-medium bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
      >
        {loadingTask === task._id ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <> Try Again</>
        )}
      </button>
    );
  } else {
    return (
      <button
        onClick={() => handleTaskClick(task)}
        disabled={loadingTask === task._id}
        className="mt-2 px-2 sm:px-4 py-2 text-xs sm:text-sm rounded font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
      >
        {loadingTask === task._id ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <>
            <FaArrowRight className="mr-2 hidden sm:block" /> Start
          </>
        )}
      </button>
    );
  }
};

const renderTasks = (tasks, icon, key) => {
  const showAll = viewMode === key;

  const sortedTasks = [...tasks].sort((a, b) => {
    const getStatusValue = (task) => {
      const status = getTaskStatus(task.title);
      if (!status) return 0;
      if (status === 'failed') return 1;
      if (status === 'pending') return 2;
      if (status === 'completed') return 3;
      return 4;
    };
    return getStatusValue(a) - getStatusValue(b);
  });

  const visibleTasks = showAll ? sortedTasks : sortedTasks.slice(0, 5);
  if (viewMode && viewMode !== key) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          {icon}
          {key === 'apps' ? 'Try New Apps' : key === 'games' ? 'Play & Earn' : 'Skill Challenges'}
        </h3>
        {!showAll && (
          <button
            onClick={() => setViewMode(key)}
            className="text-sm text-yellow-400 hover:text-yellow-300 font-medium"
          >
            View All →
          </button>
        )}
      </div>

      {showAll && (
        <button
          onClick={() => setViewMode(null)}
          className="text-sm text-blue-400 hover:underline mb-2"
        >
          ← Back to Categories
        </button>
      )}

      <div
        className={`${
          showAll
            ? "flex flex-col space-y-4"
            : "flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        }`}
      >
        {visibleTasks.map((task, i) => (
          <div
            key={i}
            className={`bg-gray-900 rounded-xl shadow hover:shadow-xl transition text-white p-4 flex-shrink-0 ${
              showAll
                ? "flex flex-row items-center w-full"
                : "w-[200px] sm:w-[250px] md:w-[280px] flex flex-col"
            }`}
          >
            <img
              src={task.banner || 'https://via.placeholder.com/100x100'}
              alt={task.title}
              className={`object-cover rounded ${
                showAll ? "w-16 h-16 sm:w-20 sm:h-20 mr-4" : "w-full h-32 sm:h-40 mb-4"
              }`}
            />
            <div className={`flex-1 space-y-2 ${showAll ? "" : "text-center"}`}>
              <h4 className="font-bold text-sm sm:text-base truncate">{task.title}</h4>
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-3">{task.description}</p>
            </div>
            <div className={`flex justify-center ${showAll ? "ml-4" : "mt-4"}`}>
              {renderButton(task)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      <div className="bg-black text-white min-h-screen px-4 sm:px-6 space-y-12">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-white flex items-center gap-2 mb-4"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-3xl font-bold text-center"> Explore & Earn</h2>

        <section className="space-y-16">
          {renderTasks(apps, <FaRocket className="text-yellow-400" />, 'apps')}
          {renderTasks(games, <FaGamepad className="text-green-400" />, 'games')}
          {renderTasks(skills, <FaBrain className="text-purple-400" />, 'skills')}
        </section>
      </div>
    </>
  );
}
