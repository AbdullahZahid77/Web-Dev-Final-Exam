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
          onClick={handleAddTask}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="mb-4">
            <h3 className="text-lg font-bold">{task.name}</h3>
            <p>{task.description}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
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
