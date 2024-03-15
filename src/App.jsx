import { useState, useEffect } from "react";
import { MdAccessTimeFilled, MdDelete, MdEdit, MdOutlineDoneOutline } from "react-icons/md";

const App = () => {
  const [allTodos, setAllTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ id: null, title: "", description: "", priority: "" });
  const [completedTodos, setCompletedTodos] = useState([]);
  const [completeTab, setIsCompleteTab] = useState(false);

  // Fetch All Todo list
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todoList")) || [];
    const savedCompletedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];
    setAllTodos(savedTodos);
    setCompletedTodos(savedCompletedTodos);
  }, []);

  // Add new Todo
  const handleAddNewToDo = () => {
    if (!newTodo.title.trim() || !newTodo.description.trim()) return;
    const updatedTodoList =
      newTodo.id === null
        ? [...allTodos, { ...newTodo, id: Date.now() }]
        : allTodos.map(todo => (todo.id === newTodo.id ? { ...newTodo } : todo));
    setAllTodos(updatedTodoList);
    localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
    setNewTodo({ id: null, title: "", description: "", priority: "low" });
  };

  // Edit Todo list
  const handleEdit = todo => {
    setNewTodo({ ...todo });
  };

  // Todo Delete Function
  const handleToDoDelete = index => {
    const reducedTodos = allTodos.filter(id => id !== index);
    localStorage.setItem("todoList", JSON.stringify(reducedTodos));
    setAllTodos(reducedTodos);
  };

  // Compete Todo Delete Function
  const CompletedTodoDelete = index => {
    const reducedCompletedTodos = completedTodos.filter(id => id !== index);
    localStorage.setItem("completedTodos", JSON.stringify(reducedCompletedTodos));
    setCompletedTodos(reducedCompletedTodos);
  };

  // Todos completed Function
  const handleComplete = index => {
    const date = new Date().toLocaleString();
    const filteredTodo = { ...allTodos[index], completedOn: date };
    const updatedCompletedList = [...completedTodos, filteredTodo];
    setCompletedTodos(updatedCompletedList);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedList));
    handleToDoDelete(index);
  };

  // todos count
  const totalTasks = allTodos.length;
  const completedTasks = completedTodos.length;

  return (
    <div>
      <h1 className="text-4xl py-5 font-bold text-center text-white">Todo App</h1>
      <div className="container mx-auto lg:w-2/5 bg-slate-100  px-8 py-10 rounded">
        {/* Input Section */}
        <div className="lg:flex flex-col gap-4 mb-16  ">
          <div className="lg:flex justify-between gap-5">
            <div className="lg:flex lg:flex-col w-full ">
              <label className="mb-3 font-bold">Title:</label>
              <input
                required
                type="text"
                value={newTodo.title}
                onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
                placeholder="Title of your Todo"
                className="p-3 outline-none rounded w-full"
              />
            </div>
            <div className="lg:flex lg:flex-col w-full my-4 lg:my-0">
              <label className=" mb-3 font-bold">Priority:</label>
              <select
                required
                className="p-[14px] outline-none rounded w-full"
                value={newTodo.priority}
                onChange={e => setNewTodo({ ...newTodo, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="lg:flex lg:flex-col">
            <label className=" mb-3 font-bold">Description:</label>
            <textarea
              required
              type="text"
              value={newTodo.description}
              onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
              placeholder="Write your description"
              className="p-3 outline-none rounded w-full"
            />
          </div>

          <div>
            <button
              className="bg-sky-700 text-white py-3 px-8 rounded 
               uppercase w-full mt-5 lg:mt-0"
              onClick={handleAddNewToDo}
            >
              {newTodo.id === null ? "Add a card" : "Update"}
            </button>
          </div>
        </div>
        {/* button group */}
        <div className="mb-10 flex justify-between">
          <button
            className={` ${
              completeTab === false ? "bg-sky-700 text-white" : "bg-white text-black "
            } py-3 px-10 text-black`}
            onClick={() => setIsCompleteTab(false)}
          >
            All ( {totalTasks} )
          </button>
          <button
            className={` ${
              completeTab === true ? "bg-sky-700 text-white" : "bg-white text-black "
            } p-3 text-black`}
            onClick={() => setIsCompleteTab(true)}
          >
            Completed ( {completedTasks} )
          </button>
        </div>
        {/* list area */}
        <div className=" flex flex-col">
          {completeTab
            ? completedTodos.map((item, index) => (
                <div
                  className="lg:flex justify-between  gap-10 bg-white p-5 rounded mb-5"
                  key={index}
                >
                  <div>
                    <h3 className="text-3xl fon-bold ">{item.title}</h3>
                    <p className="my-3">{item.description}</p>
                    <button className="flex items-center gap-1 text-green-700 px-2 py-1 font-bold rounded">
                      {" "}
                      <MdAccessTimeFilled /> Completed at: {item.completedOn}
                    </button>
                  </div>
                  <div>
                    <button
                      className="flex items-center gap-1 text-red-500 px-4 py-2 bg-red-100 font-bold rounded lg:mt-0 mt-5"
                      onClick={() => CompletedTodoDelete(index)}
                    >
                      {" "}
                      Delete <MdDelete />
                    </button>
                  </div>
                </div>
              ))
            : allTodos.map((item, index) => (
                <div
                  className="lg:flex justify-between  gap-10 bg-white  p-5 rounded mb-5"
                  key={index}
                >
                  <div>
                    <h2
                      className={
                        item.priority === "low"
                          ? "bg-yellow-400 mb-2  w-20 rounded"
                          : item.priority === "medium"
                          ? "bg-orange-400 mb-2  w-20 rounded"
                          : "bg-red-500 mb-2  w-20 rounded"
                      }
                    ></h2>
                    <div className="flex gap-4 items-center">
                      <h3 className="text-3xl fon-bold ">{item.title} </h3>
                      <div
                        className={`${
                          item.priority === "low"
                            ? "bg-yellow-400 "
                            : item.priority === "medium"
                            ? "bg-orange-400  "
                            : "bg-red-500   "
                        } px-3 rounded uppercase font-bold`}
                      >
                        <small> {item.priority}</small>
                      </div>
                    </div>
                    <p className="mt-4 mb-10">{item.description}</p>

                    <div className="flex items-center gap-4">
                      <button
                        className=" flex items-center gap-1 text-blue-500 px-4 py-2 bg-blue-200 font-bold rounded"
                        onClick={() => handleEdit(item)}
                      >
                        Edit <MdEdit />
                      </button>
                      <button
                        className="flex items-center gap-1 text-red-500 px-4 py-2 bg-red-100 font-bold rounded"
                        onClick={() => handleToDoDelete(index)}
                      >
                        {" "}
                        Delete <MdDelete />
                      </button>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleComplete(index)}
                      className="flex items-center gap-1 text-green-600 bg-green-200 py-2 px-4 font-bold rounded mt-5 lg:mt-0"
                    >
                      <MdOutlineDoneOutline /> <span>Done</span>
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default App;
