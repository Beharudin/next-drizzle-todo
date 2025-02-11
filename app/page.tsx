"use client";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type Task = {
  id: number;
  title: string;
  completed: boolean;
  user: User;
};

export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  useEffect(() => {
    // Fetch tasks
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks));
  }, []);

  const addTask = async () => {
    if (!selectedUser) return alert("Please select a user!");

    const newTaskData = {
      title: newTask,
      userId: selectedUser,
    };
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTaskData),
    });

    if (res.ok) {
      const { task } = await res.json();
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const toggleTask = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (res.ok) {
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg">
      <h1 className="text-xl font-bold mb-4">To-Do List</h1>

      {/* User Selection Dropdown */}
      <select
        className="border p-2 w-full mb-4"
        value={selectedUser || ""}
        onChange={(e) => setSelectedUser(Number(e.target.value))}
      >
        <option value="" disabled>
          Select User
        </option>
        {mockUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      {/* Task Input */}
      <input
        className="border p-2 w-full mb-5"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Task Title"
      />

      <button
        onClick={addTask}
        className="bg-blue-500 text-white px-4 py-2 w-full"
      >
        Add Task
      </button>

      {/* Task List */}
      <ul className="mt-4">
        {tasks?.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-2 border-b"
          >
            <div>
              <span className={task.completed ? "line-through" : ""}>
                {task.title}
              </span>
              <p className="text-sm text-gray-500">
                Assigned to: {task.user.name} ({task.user.email})
              </p>
            </div>
            <button
              onClick={() => toggleTask(task)}
              className="text-sm text-blue-600"
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
