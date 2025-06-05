import React, { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import TaskItem from "./components/TaskItem";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type FilterType = "all" | "completed" | "active";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          { id: 1, title: "Buy groceries", completed: false },
          { id: 2, title: "Walk the dog", completed: true },
        ];
  });

  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const addTask = (title: string) => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <h1 className="text-2xl font-bold text-white">
            Professional Task Manager
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="p-6">
          <AddTask onAdd={addTask} />

          <div className="flex space-x-2 mb-4">
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </FilterButton>
            <FilterButton
              active={filter === "active"}
              onClick={() => setFilter("active")}
            >
              Active
            </FilterButton>
            <FilterButton
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
            >
              Completed
            </FilterButton>
          </div>

          <TaskCount tasks={tasks} />

          <ul className="divide-y divide-gray-200">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))
            ) : (
              <li className="py-4 text-center text-gray-500">
                {filter === "all"
                  ? "No tasks yet. Add one above!"
                  : filter === "completed"
                    ? "No completed tasks"
                    : "No active tasks"}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

const FilterButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
      active
        ? "bg-indigo-600 text-white shadow-md"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

const TaskCount: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="text-sm text-gray-500 mb-3">
      {completedCount} of {totalCount} tasks completed
      {totalCount > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className="bg-gradient-to-r from-blue-400 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};
