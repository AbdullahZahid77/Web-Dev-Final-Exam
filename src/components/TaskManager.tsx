import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

interface Task {
  _id: string;
  name: string;
  description: string;
  dueDate: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null); // State for editing task
  const user = "admin"; // Hardcoded user for now

  // Fetch tasks
  useEffect(() => {
    apiClient
      .get(`/tasks?user=${user}`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Format the date as yyyy-MM-dd
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Format to yyyy-MM-dd
  };

  // Add a new task
  const handleAddTask = () => {
    apiClient
      .post("/tasks", { ...newTask, user })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask({ name: "", description: "", dueDate: "" });
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Edit a task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      name: task.name,
      description: task.description,
      dueDate: formatDate(task.dueDate), // Format the date when editing
    });
  };

  // Update task
  const handleUpdateTask = () => {
    if (editingTask) {
      apiClient
        .put(`/tasks/${editingTask._id}`, { ...newTask })
        .then((response) => {
          const updatedTask = response.data;
          setTasks(
            tasks.map((task) =>
              task._id === updatedTask._id ? updatedTask : task
            )
          );
          setNewTask({ name: "", description: "", dueDate: "" });
          setEditingTask(null); // Clear editing state after update
        })
        .catch((error) => console.error("Error updating task:", error));
    }
  };

  // Delete a task
  const handleDeleteTask = (id: string) => {
    apiClient
      .delete(`/tasks/${id}`)
      .then(() => setTasks(tasks.filter((task) => task._id !== id)))
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        Task Manager
      </h1>

      {/* Form to add or edit tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 border rounded-xl shadow-md bg-gray-50">
        <div>
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="block w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="block w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            className="block w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={editingTask ? handleUpdateTask : handleAddTask}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>

      {/* Task List */}
      <ul className="space-y-6">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-indigo-600">
              {task.name}
            </h3>
            <p className="text-gray-700 mb-2">{task.description}</p>
            <p className="text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleEditTask(task)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
