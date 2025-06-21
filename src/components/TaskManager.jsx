import React, { useState, useEffect } from 'react';
import Button from './Button';

/**
 * Custom hook for managing tasks with localStorage persistence
 */
const useLocalStorageTasks = () => {
  // Initialize state from localStorage or with empty array
  const [tasks, setTasks] = useState(() => { 
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Update localStorage when tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (text, priority = 'Medium', dueDate = '') => {
    if (text.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
          priority,
          dueDate,
        },
      ]);
    }
  };

  // Toggle task completion status
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Edit a task
  const editTask = (id, newText, newPriority, newDueDate) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, text: newText, priority: newPriority, dueDate: newDueDate }
          : task
      )
    );
  };

  // Bulk mark all as completed
  const markAllCompleted = () => {
    setTasks(tasks.map(task => ({ ...task, completed: true })));
  };
  // Bulk delete all completed
  const deleteAllCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };
  return { tasks, addTask, toggleTask, deleteTask, editTask, markAllCompleted, deleteAllCompleted };
};

/**
 * TaskManager component for managing tasks
 */
const TaskManager = () => {
  const { tasks, addTask, toggleTask, deleteTask, editTask, markAllCompleted, deleteAllCompleted } = useLocalStorageTasks();
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState('Medium');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'dueDate') {
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Toast helpers
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(newTaskText, newTaskPriority, newTaskDueDate);
    setNewTaskText('');
    setNewTaskPriority('Medium');
    setNewTaskDueDate('');
    showToast('Task added!');
  };

  // Handle edit start
  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
    setEditingPriority(task.priority || 'Medium');
    setEditingDueDate(task.dueDate || '');
  };

  // Handle edit save
  const handleEditSave = (id) => {
    if (editingText.trim()) {
      editTask(id, editingText, editingPriority, editingDueDate);
      setEditingId(null);
      setEditingText('');
      setEditingPriority('Medium');
      setEditingDueDate('');
      showToast('Task updated!');
    }
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
    setEditingPriority('Medium');
    setEditingDueDate('');
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
    setShowConfirm(true);
    setDeleteId(id);
  };
  const confirmDelete = () => {
    deleteTask(deleteId);
    setShowConfirm(false);
    setDeleteId(null);
    showToast('Task deleted!', 'danger');
  };
  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Keyboard accessibility for edit
  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') handleEditSave(id);
    if (e.key === 'Escape') handleEditCancel();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Task Manager</h2>
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white ${toast.type === 'danger' ? 'bg-red-600' : 'bg-green-600'}`}>{toast.msg}</div>
      )}
      {/* Bulk actions */}
      <div className="flex gap-2 mb-4">
        <Button variant="success" size="sm" onClick={() => { markAllCompleted(); showToast('All tasks marked as completed!'); }}>
          Mark All Completed
        </Button>
        <Button variant="danger" size="sm" onClick={() => { deleteAllCompleted(); showToast('All completed tasks deleted!', 'danger'); }}>
          Delete All Completed
        </Button>
      </div>
      {/* Task input form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <select
            value={newTaskPriority}
            onChange={e => setNewTaskPriority(e.target.value)}
            className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <input
            type="date"
            value={newTaskDueDate}
            onChange={e => setNewTaskDueDate(e.target.value)}
            className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <Button type="submit" variant="primary">
            Add Task
          </Button>
        </div>
      </form>

      {/* Filter and sort controls */}
      <div className="flex flex-col md:flex-row gap-2 mb-4 justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="createdAt">Created</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      {/* Task list */}
      <ul className="space-y-2 min-h-[120px]">
        {filteredTasks.length === 0 ? (
          <li className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>No tasks found</span>
          </li>
        ) : (
          filteredTasks.map((task) => {
            const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
            const priorityColors = {
              High: 'bg-red-500 text-white',
              Medium: 'bg-yellow-400 text-gray-900',
              Low: 'bg-green-500 text-white',
            };
            return (
              <li
                key={task.id}
                className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 transition-all duration-200 ${isOverdue ? 'border-red-500' : ''}`}
                style={{ transition: 'all 0.2s' }}
              >
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  {editingId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        onKeyDown={e => handleEditKeyDown(e, task.id)}
                        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        autoFocus
                      />
                      <select
                        value={editingPriority}
                        onChange={e => setEditingPriority(e.target.value)}
                        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ml-2"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <input
                        type="date"
                        value={editingDueDate}
                        onChange={e => setEditingDueDate(e.target.value)}
                        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ml-2"
                      />
                      <Button size="sm" variant="success" onClick={() => handleEditSave(task.id)} className="ml-2">Save</Button>
                      <Button size="sm" variant="secondary" onClick={handleEditCancel} className="ml-1">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <span
                        className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                      >
                        {task.text}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${priorityColors[task.priority]}`}>{task.priority}</span>
                      {task.dueDate && (
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}>
                          Due: {task.dueDate}
                        </span>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(task)} className="ml-2">Edit</Button>
                    </>
                  )}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  aria-label="Delete task"
                >
                  Delete
                </Button>
              </li>
            );
          })
        )}
      </ul>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Task stats */}
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>
          {tasks.filter((task) => !task.completed).length} tasks remaining
        </p>
      </div>
    </div>
  );
};

export default TaskManager;