import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BsFillCheckCircleFill,
  BsCircleFill,
  BsFillTrashFill,
} from "react-icons/bs";
import Create from "../Components/Create";
import Card from "../Components/Card";
import { toast } from "react-toastify";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [userData, setUserData] = useState({ user: [], todo: [] });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [filter, setFilter] = useState("Today");
  const [taskType, setTaskType] = useState("today");

  async function getUserData() {
    try {
      const userResponse = await axios.get("http://localhost:3001/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userResponse.status !== 200) {
        navigate("/login");
        return;
      }
      const todoResponse = await axios.get(
        `http://localhost:3001/get?type=${taskType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (todoResponse.status !== 200) {
        console.error("Error fetching todos:", todoResponse.status);
        return;
      }
      const { userData } = userResponse.data;
      const { todoData } = todoResponse.data;

      setUserData({ user: userData, todo: todoData });
      setTodos(todoData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    }
  }
  useEffect(() => {
    getUserData();
  }, [taskType]);


  const handleEdit = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .put(`http://localhost:3001/update/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        getUserData();
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, done: !todo.done } : todo
          )
        );
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .delete(`http://localhost:3001/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        getUserData();
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.log(err));
  };
  const currentDate = new Date().toLocaleDateString("en-GB");


  return (
    <div className="">
      <div className="flex flex-col items-center pt-[30px] md:pt-[100px] max-sm:mx-2">
        <div className="sm:w-[500px]">
          <div className="md:pb-10 pb-5 flex justify-between flex-wrap">
            <Card
              text="Today"
              bgColor="bg-[#60B4DD]"
              onClick={() => setTaskType("today")}
            />
            <Card
              text="Upcoming"
              bgColor="bg-[#7DCEA0]"
              onClick={() => setTaskType("upcoming")}
            />
            <Card
              text="All Tasks"
              bgColor="bg-[#F7DC6F]"
              onClick={() => setTaskType("all")}
            />
          </div>

          <div className="md:mb-10 mb-5 bg-[#BCE7FC] rounded-xl p-3">
            <div className="flex justify-between items-center">
              <h1 className="sm:text-xl text-lg font-medium">
                Mr. {userData.user.name}
              </h1>
              <p className="sm:text-lg text-sm">
                <span className="font-semibold">Date:</span> {currentDate}
              </p>
            </div>
            <h1 className="text-lg text-gray-600">Welcome to Todo App </h1>
          </div>

          <div className="mb-10 border-2 rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-center sm:text-2xl text-lg font-serif font-medium">
                {taskType === "today"
                  ? "Today's "
                  : taskType === "upcoming"
                  ? "Upcoming  "
                  : "All "}
                Task
              </h2>

              <button
                onClick={() => setShow((prevShow) => !prevShow)}
                className="px-3 py-1 rounded bg-[#388db8] text-white"
              >
                {show ? "Cancel" : "Add Task"}
              </button>
            </div>

            {show && <Create />}

            {todos.length === 0 ? (
              <div>
                <h2 className="text-center text-lg font-serif mt-2">
                  No Task Found
                </h2>
              </div>
            ) : (
              <>
                {/* Task Type condition */}
                {taskType === "today" ? (
                  <div className="flex flex-col gap-3 mx-auto font-serif mt-2 text-white">
                    {todos.map((todo) => (
                      <div
                        key={todo._id}
                        className="rounded-lg gap-2 cursor-pointer py-2 px-3 bg-gray-800"
                      >
                        <div className="flex justify-between items-center">
                          <div
                            className="flex items-center gap-2"
                            onClick={() => handleEdit(todo._id)}
                          >
                            {todo.done ? (
                              <BsFillCheckCircleFill className="icon text-green-400" />
                            ) : (
                              <BsCircleFill className="text-gray-400" />
                            )}
                            <p className={`${todo.done ? "line-through" : ""}`}>
                              {todo.task}
                            </p>
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => handleDelete(todo._id)}
                          >
                            <BsFillTrashFill />
                          </div>
                        </div>
                        <div className="mt-2 bg-[#388db8] rounded-lg p-2 text-black">
                          <div className="flex justify-center gap-2">
                            <h1>Priority:</h1>
                            <p className="text-yellow-400">
                              {todo.priority || "N/A"}
                            </p>
                          </div>
                          <div className="flex justify-center gap-2">
                            <h1>Deadline:</h1>
                            <p className="text-white">
                              {todo.deadlineDate || "No Deadline"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Upcoming Tasks UI */}
                {taskType === "upcoming" ? (
                  <div className="mt-4">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const upcomingDate = new Date();
                      upcomingDate.setDate(upcomingDate.getDate() + index + 1); // Next 7 days
                      const formattedDate =
                        upcomingDate.toLocaleDateString("en-GB");

                      const tasksForDate = todos.filter(
                        (todo) =>
                          new Date(todo.date).toLocaleDateString("en-GB") ===
                          formattedDate
                      );

                      return (
                        <div key={index}>
                          <h3 className="text-center my-3 text-lg">
                            {formattedDate}
                          </h3>
                          {tasksForDate.length === 0 ? (
                            <p className="text-center text-gray-700 bg-gray-100 rounded border p-1 ">
                              No Task Found
                            </p>
                          ) : (
                            tasksForDate.map((todo) => (
                              <div
                                key={todo._id}
                                className="rounded-lg gap-2 cursor-pointer py-2 px-3 bg-gray-800 text-white"
                              >
                                <div className="flex justify-between items-center">
                                  <div
                                    className="flex items-center gap-2"
                                    onClick={() => handleEdit(todo._id)}
                                  >
                                    {todo.done ? (
                                      <BsFillCheckCircleFill className="icon text-green-400" />
                                    ) : (
                                      <BsCircleFill className="text-gray-400" />
                                    )}
                                    <p
                                      className={`${
                                        todo.done ? "line-through" : ""
                                      }`}
                                    >
                                      {todo.task}
                                    </p>
                                  </div>
                                  <div
                                    className="cursor-pointer"
                                    onClick={() => handleDelete(todo._id)}
                                  >
                                    <BsFillTrashFill />
                                  </div>
                                </div>
                                <div className="mt-2 bg-[#388db8] rounded-lg p-2 text-black">
                                  <div className="flex justify-center gap-2">
                                    <h1>Priority:</h1>
                                    <p className="text-yellow-400">
                                      {todo.priority || "N/A"}
                                    </p>
                                  </div>
                                  <div className="flex justify-center gap-2">
                                    <h1>Deadline:</h1>
                                    <p className="text-white">
                                      {todo.deadlineDate || "No Deadline"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/* All Tasks UI */}
                {taskType === "all" ? (
                  <div className="flex flex-col gap-3 mx-auto font-serif mt-2 text-white">
                    {todos.sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((todo) => {
                      const formattedDate = new Date(
                        todo.date
                      ).toLocaleDateString("en-GB"); // Format date as "dd/mm/yyyy"
                      return (
                        <>
                          <p className="text-center mt-1 font-sans text-black text-lg">
                            {formattedDate}
                          </p>
                          <div
                            key={todo._id}
                            className="rounded-lg gap-2 cursor-pointer py-2 px-3 bg-gray-800"
                          >
                            <div className="flex justify-between items-center">
                              <div
                                className="flex items-center gap-2"
                                onClick={() => handleEdit(todo._id)}
                              >
                                {todo.done ? (
                                  <BsFillCheckCircleFill className="icon text-green-400" />
                                ) : (
                                  <BsCircleFill className="text-gray-400" />
                                )}
                                <p
                                  className={`${
                                    todo.done ? "line-through" : ""
                                  }`}
                                >
                                  {todo.task}
                                </p>
                              </div>
                              <div
                                className="cursor-pointer"
                                onClick={() => handleDelete(todo._id)}
                              >
                                <BsFillTrashFill />
                              </div>
                            </div>
                            <div className="mt-2 bg-[#388db8] rounded-lg p-2 text-black">
                              <div className="flex justify-center gap-2">
                                <h1>Priority:</h1>
                                <p className="text-yellow-400">
                                  {todo.priority || "N/A"}
                                </p>
                              </div>
                              <div className="flex justify-center gap-2">
                                <h1>Deadline:</h1>
                                <p className="text-white">
                                  {todo.deadlineDate || "No Deadline"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}