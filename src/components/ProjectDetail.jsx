import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import { updateTodos, updateTodoStatus, updateProject } from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditeModal from "./EditeModal";

const ProjectDetail = () => {
  const { id } = useParams();
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoError, setNewTodoError] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingError, setEditingError] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  // const [editedTitle, setEditedTitle] = useState("");
  // const [titleError, setTitleError] = useState("");
  const {
    currentProject,
    fetchProjectById,
    addTodo,
    removeTodo,
    exportSummary,
  } = useProjects();

  // Fetch project details when component mounts or project ID changes
  useEffect(() => {
    const fetchProject = async () => {
      try {
        await fetchProjectById(id);
      } catch (error) {
        toast.error("Failed to fetch project details.");
      }
    };

    fetchProject();
  }, [id, fetchProjectById]);

  // Handler to add a new todo
  const handleAddTodo = async () => {
    if (!newTodoName || !newTodoDescription) {
      setNewTodoError("Please enter both name and description for the todo.");
      return;
    }
    try {
      await addTodo(id, { name: newTodoName, description: newTodoDescription });
      setNewTodoName("");
      setNewTodoDescription("");
      setNewTodoError("");
      toast.success("Todo added successfully");
    } catch (error) {
      toast.error("Failed to add todo.");
    }
  };

  // Handler to update an existing todo
  const handleUpdateTodo = async (todoId) => {
    if (!editingName || !editingDescription) {
      setEditingError("Please enter both name and description for the todo.");
      return;
    }
    try {
      await updateTodos(todoId, {
        name: editingName,
        description: editingDescription,
        updatedDate: new Date(),
      });
      toast.success("Todo updated successfully");
      setEditingTodo(null);
      setEditingError("");
    } catch (error) {
      toast.error("Failed to update todo.");
    }
  };

  // Handler to change the status of a todo
  const handleTodoStatusChange = async (todoId, status) => {
    try {
      await updateTodoStatus(todoId, { status });
      toast.success("Todo status changed");
    } catch (error) {
      toast.error("Failed to change todo status.");
    }
  };

  // Handler to delete a todo
  const handleDeleteTodo = async (todoId) => {
    try {
      await removeTodo(todoId);
      toast.success("Todo deleted");
    } catch (error) {
      toast.error("Failed to delete todo.");
    }
  };

  // Handler to export the project summary
  const handleExportSummary = async () => {
    try {
      await exportSummary(id);
    } catch (error) {
      toast.error("Failed to export summary.");
    }
  };

  // Handler to update the project title
  const handleUpdateTitle = async (editTitle) => {
    if (!editTitle) {
      setTitleError("Please enter a title for the project.");
      return;
    }
    try {
      await updateProject(id, { title: editTitle });
      setIsEditingTitle(false);
      setTitleError("");
      toast.success("Project title updated");
    } catch (error) {
      toast.error("Failed to update project title.");
    }
  };

  // Handler to cancel title editing
  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
    setEditedTitle(currentProject.title || "");
    setTitleError("");
  };

  if (!currentProject) return <div>Loading...</div>;

  // Separate completed and pending todos
  const completedTodos = currentProject.todos.filter((todo) => todo.status);
  const pendingTodos = currentProject.todos.filter((todo) => !todo.status);
  const totalTodos = currentProject.todos.length;
  const completedCount = completedTodos.length;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      {/* Project Title Section */}
      {isEditingTitle ? (
        <EditeModal
          cancel={handleCancelEditTitle}
          updateTitle={handleUpdateTitle}
        />
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

      {/* Add New Todo Section */}
      <Link to={"/trash"}>Trash</Link>

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

      {/* Todos Summary Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Summary: {completedCount}/{totalTodos} todos completed
        </h3>

        {/* Pending Todos */}
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
                    {editingError && (
                      <p className="text-red-500 text-sm mt-2">
                        {editingError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold text-gray-700">
                        {todo.name}
                      </h4>
                      <div>
                        <button
                          onClick={() =>
                            handleTodoStatusChange(todo._id, !todo.status)
                          }
                          className={`py-1 px-2 text-white rounded-lg ${
                            todo.status
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-yellow-600 hover:bg-yellow-700"
                          }`}
                        >
                          {todo.status ? "Completed" : "Mark as Complete"}
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="py-1 px-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            setEditingTodo(todo._id);
                            setEditingName(todo.name);
                            setEditingDescription(todo.description);
                          }}
                          className="py-1 px-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-2"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600">{todo.description}</p>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No pending todos.</p>
          )}
        </ul>

        {/* Completed Todos */}
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Completed Todos
        </h3>
        <ul className="space-y-4 mb-8">
          {completedTodos.length > 0 ? (
            completedTodos.map((todo) => (
              <li
                key={todo._id}
                className="border border-gray-300 rounded-lg p-4 bg-white shadow-md flex items-center justify-between"
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-gray-700">
                      {todo.name}
                    </h4>
                    <div>
                      <button
                        onClick={() =>
                          handleTodoStatusChange(todo._id, !todo.status)
                        }
                        className={`py-1 px-2 text-white rounded-lg ${
                          todo.status
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-yellow-600 hover:bg-yellow-700"
                        }`}
                      >
                        {todo.status ? "Completed" : "Mark as Complete"}
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="py-1 px-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">{todo.description}</p>
                </div>
              </li>
            ))
          ) : (
            <p>No completed todos.</p>
          )}
        </ul>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProjectDetail;
