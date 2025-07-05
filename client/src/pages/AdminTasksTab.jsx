import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from 'react-icons/fa';

const AdminTasksTab = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    reward: '',
    category: '',
    link: '',
    banner: null,
    isFeatured: false,
    isSlider: false
  });

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [targetTaskId, setTargetTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/tasks/all');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const confirmAction = (action, taskId = null) => {
    setModalAction(action);
    setTargetTaskId(taskId);
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    try {
      if (modalAction === 'save') {
        const formData = new FormData();
        formData.append('title', editTask.title);
        formData.append('description', editTask.description);
        formData.append('reward', editTask.reward);
        formData.append('category', editTask.category);
        formData.append('link', editTask.link);
        formData.append('isFeatured', editTask.isFeatured);
        formData.append('isSlider', editTask.isSlider);


        if (editTask.banner && typeof editTask.banner !== 'string') {
          formData.append('banner', editTask.banner);
        }

        await axios.put(`/tasks/update/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setEditingId(null);
      } else if (modalAction === 'delete') {
        await axios.delete(`/tasks/${targetTaskId}`);
      } else if (modalAction === 'add') {
        const formData = new FormData();
        formData.append('title', newTask.title);
        formData.append('description', newTask.description);
        formData.append('reward', newTask.reward);
        formData.append('category', newTask.category);
        formData.append('link', newTask.link);
        formData.append('isFeatured', newTask.isFeatured);
        formData.append('isSlider', newTask.isSlider);
        if (newTask.banner) {
          formData.append('banner', newTask.banner);
        }

        await axios.post('/tasks/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setNewTask({
          title: '',
          description: '',
          reward: '',
          category: '',
          link: '',
          banner: null,
          isFeatured: false,
          isSlider: false,
        });
        setShowAddForm(false);
      }

      fetchTasks();
    } catch (err) {
      alert(`Failed to ${modalAction} task`);
    } finally {
      setShowModal(false);
    }
  };


  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <p className="text-lg font-semibold mb-4">
          Are you sure you want to {modalAction === 'save' ? 'save changes' : modalAction === 'delete' ? 'delete this task' : 'add this task'}?
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={handleModalConfirm} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Yes
          </button>
          <button onClick={() => setShowModal(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">📋 Task Management</h2>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mb-4 rounded flex items-center gap-2"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        <FaPlus /> Add Task
      </button>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">➕ Create New Task</h3>

          {['title', 'description', 'link'].map((field) => (
            <input
              key={field}
              className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={newTask[field]}
              onChange={(e) => setNewTask({ ...newTask, [field]: e.target.value })}
            />
          ))}

          <input
            type="file"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
            accept="image/*"
            onChange={(e) => setNewTask({ ...newTask, banner: e.target.files[0] })}
          />

          <select
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="apps">Apps</option>
            <option value="games">Games</option>
            <option value="skills">Skills</option>
          </select>

          <input
            type="number"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
            placeholder="Reward"
            value={newTask.reward}
            onChange={(e) =>
              setNewTask({ ...newTask, reward: e.target.value === '' ? '' : Number(e.target.value) })
            }
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newTask.isFeatured}
                onChange={(e) => setNewTask({ ...newTask, isFeatured: e.target.checked })}
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newTask.isSlider}
                onChange={(e) => setNewTask({ ...newTask, isSlider: e.target.checked })}
              />
              Slider
            </label>
          </div>

          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => confirmAction('add')}
          >
            ✅ Save Task
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-white">Loading tasks...</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="p-2">Banner</th>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Link</th>
                <th>Reward</th>
                <th>Featured</th>
                <th>Slider</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className={`border-t ${editingId === task._id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                  <td className="p-2">
                    {editingId === task._id ? (
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full border px-2 py-1 text-sm"
                        onChange={(e) => setEditTask({ ...editTask, banner: e.target.files[0] })}
                      />
                    ) : task.banner ? (
                      <img src={`${import.meta.env.VITE_BACKEND_URL}${task.banner}`} alt="Task Banner"
                        className="w-14 h-10 object-cover rounded"
                      />
                    ) : (
                      '—'
                    )}
                  </td>

                  <td className="p-2">{editingId === task._id ? <input className="border px-2 py-1 rounded w-full" value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} /> : task.title}</td>
                  <td className="p-2">{editingId === task._id ? <input className="border px-2 py-1 rounded w-full" value={editTask.description} onChange={(e) => setEditTask({ ...editTask, description: e.target.value })} /> : task.description?.slice(0, 40) + '...'}</td>
                  <td className="p-2">{editingId === task._id ? <select className="border px-2 py-1 rounded w-28" value={editTask.category} onChange={(e) => setEditTask({ ...editTask, category: e.target.value })}><option value="apps">Apps</option><option value="games">Games</option><option value="skills">Skills</option></select> : task.category}</td>
                  <td className="p-2">{editingId === task._id ? <input className="border px-2 py-1 rounded w-32" value={editTask.link} onChange={(e) => setEditTask({ ...editTask, link: e.target.value })} /> : <a href={task.link} className="text-blue-600 underline" target="_blank" rel="noreferrer">Open</a>}</td>
                  <td className="p-2">{editingId === task._id ? <input type="number" className="border px-2 py-1 rounded w-20" value={editTask.reward} onChange={(e) => setEditTask({ ...editTask, reward: Number(e.target.value) })} /> : `₹${task.reward}`}</td>
                  <td className="p-2">{editingId === task._id ? <input type="checkbox" checked={editTask.isFeatured} onChange={(e) => setEditTask({ ...editTask, isFeatured: e.target.checked })} /> : task.isFeatured ? '✅' : '❌'}</td>
                  <td className="p-2">{editingId === task._id ? <input type="checkbox" checked={editTask.isSlider} onChange={(e) => setEditTask({ ...editTask, isSlider: e.target.checked })} /> : task.isSlider ? '✅' : '❌'}</td>
                  <td className="space-x-2 p-2">
                    {editingId === task._id ? (
                      <>
                        <button onClick={() => confirmAction('save')} className="text-green-600"><FaSave /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-600"><FaTimes /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(task._id); setEditTask({ ...task }); }} className="text-yellow-600"><FaEdit /></button>
                        <button onClick={() => confirmAction('delete', task._id)} className="text-red-600"><FaTrash /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <Modal />}
    </div>
  );
};

export default AdminTasksTab;
