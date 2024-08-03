import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import { updateTodos, updateTodoStatus, updateProject } from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectDetail = () => {
  const { id } = useParams();
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoError, setNewTodoError] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [setEditingError] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const {
    currentProject,
    fetchProjectById,
    addTodo,
    removeTodo,
    exportSummary,
  } = useProjects();

  useEffect(() => {
    fetchProjectById(id);
  }, [id, fetchProjectById]);

  const handleAddTodo = async () => {
    if (!newTodoName || !newTodoDescription) {
      setNewTodoError("Please enter both name and description for the todo.");
      return;
    }
    await addTodo(id, { name: newTodoName, description: newTodoDescription });
    setNewTodoName("");
    setNewTodoDescription("");
    setNewTodoError("");
    toast.success("Todo added successfuly");
  };

  const handleUpdateTodo = async (todoId) => {
    if (!editingName || !editingDescription) {
      setEditingError("Please enter both name and description for the todo.");
      return;
    }
    await updateTodos(todoId, {
      name: editingName,
      description: editingDescription,
      updatedDate: new Date(),
    });
    toast.success("Todo updated successfuly");
    setEditingTodo(null);
    setEditingError("");
  };

  const handleTodoStatusChange = async (todoId, status) => {
    await updateTodoStatus(todoId, { status });
    toast.success("Todo status changed");
  };

  const handleDeleteTodo = async (todoId) => {
    await removeTodo(todoId);
    toast.success("Todo deleted");
  };

  const handleExportSummary = async () => {
    await exportSummary(id);
  };

  const handleUpdateTitle = async () => {
    if (!editedTitle) {
      setTitleError("Please enter a title for the project.");
      return;
    }
    await updateProject(id, { title: editedTitle });
    setIsEditingTitle(false);
    setTitleError("");
    toast.success("Project title updated");
  };

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
    setEditedTitle(currentProject.title || "");
    setTitleError("");
  };

  if (!currentProject) return <div>Loading...</div>;

  const completedTodos = currentProject.todos.filter((todo) => todo.status);
  const pendingTodos = currentProject.todos.filter((todo) => !todo.status);
  const totalTodos = currentProject.todos.length;
  const completedCount = completedTodos.length;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      {isEditingTitle ? (
        <div className="mb-6 flex flex-col items-start">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full mb-3"
            placeholder="Edit project title"
          />
          {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleUpdateTitle}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Title
            </button>
            <button
              onClick={handleCancelEditTitle}
              className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 flex-grow">
            {currentProject.title}
          </h2>
          <button
            onClick={() => {
              setIsEditingTitle(true);
              setEditedTitle(currentProject.title || "");
            }}
            className="py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Edit Title
          </button>
        </div>
      )}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newTodoName}
            onChange={(e) => setNewTodoName(e.target.value)}
            placeholder="New todo name"
            className="border border-gray-300 rounded-lg p-3 w-full"
          />
          <input
            type="text"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            placeholder="New todo description"
            className="border border-gray-300 rounded-lg p-3 w-full"
          />
        </div>
        {newTodoError && (
          <p className="text-red-500 text-sm mb-4">{newTodoError}</p>
        )}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleAddTodo}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Todo
          </button>
          <button
            onClick={handleExportSummary}
            className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Export Summary
          </button>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Summary: {completedCount}/{totalTodos} todos completed
        </h3>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Pending Todos
        </h3>
        <ul className="space-y-4 mb-8">
          {pendingTodos.length > 0 ? (
            pendingTodos.map((todo) => (
              <li
                key={todo._id}
                className="border border-gray-300 rounded-lg p-4 bg-white shadow-md flex items-center justify-between"
              >
                {editingTodo === todo._id ? (
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Todo name"
                      className="border border-gray-300 rounded-lg p-3 w-full mb-2"
                    />
                    <input
                      type="text"
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      placeholder="Todo description"
                      className="border border-gray-300 rounded-lg p-3 w-full mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateTodo(todo._id)}
                        className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTodo(null)}
                        className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col w-full">
                    <p className="text-lg font-bold">{todo.name}</p>
                    <p className="text-gray-500">{todo.description}</p>
                    <p className="pt-4 text-sm text-gray-600">
                      Created: {new Date(todo.createdDate).toLocaleDateString()}
                    </p>
                    {todo.updatedDate && (
                      <p className="text-sm text-gray-600">
                        Updated:{" "}
                        {new Date(todo.updatedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.status}
                    onChange={() =>
                      handleTodoStatusChange(todo._id, !todo.status)
                    }
                    className="mr-4"
                  />
                  <button
                    onClick={() => {
                      setEditingTodo(todo._id);
                      setEditingName(todo.name || "");
                      setEditingDescription(todo.description || "");
                    }}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No pending todos</p>
          )}
        </ul>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Completed Todos
        </h3>
        <ul className="space-y-4">
          {completedTodos.length > 0 ? (
            completedTodos.map((todo) => (
              <li
                key={todo._id}
                className="border border-gray-300 rounded-lg p-4 bg-white shadow-md flex items-center justify-between"
              >
                <div className="flex flex-col w-full">
                  <p className="text-lg font-bold">{todo.name}</p>
                  <p className="text-gray-500">{todo.description}</p>
                  <p className="pt-4 text-sm text-gray-600">
                    Created: {new Date(todo.createdDate).toLocaleDateString()}
                  </p>
                  {todo.updatedDate && (
                    <p className="text-sm text-gray-600">
                      Updated: {new Date(todo.updatedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.status}
                    onChange={() =>
                      handleTodoStatusChange(todo._id, !todo.status)
                    }
                    className="mr-4"
                  />
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No completed todos</p>
          )}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProjectDetail;
