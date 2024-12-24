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
      dueDate: task.dueDate,
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          className="block mb-2 w-full px-3 py-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="block mb-2 w-full px-3 py-2 border rounded"
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className="block mb-2 w-full px-3 py-2 border rounded"
        />
        <button
          onClick={editingTask ? handleUpdateTask : handleAddTask} // Conditional to handle add or update
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="mb-4">
            <h3 className="text-lg font-bold">{task.name}</h3>
            <p>{task.description}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <button
              onClick={() => handleEditTask(task)}
              className="text-blue-500 underline mt-2 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteTask(task._id)}
              className="text-red-500 underline mt-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
