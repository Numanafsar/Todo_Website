import { useState } from "react";
import CustomInputField from "../Components/CustomInputField";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://todo-website-p3og.onrender.com/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      toast.success(response.data.message);
      navigate("/");
      const response2 = await axios.get("https://todo-website-p3og.onrender.com/get", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      const { userData, todoData } = response2.data;
      const formattedCurrentDate = new Date().toISOString().split("T")[0];

      const dueTasks = todoData.filter(
        (task) => task.deadlineDate === formattedCurrentDate
      );
      if (dueTasks.length > 0) {
        const taskNames = dueTasks.map((task) => `"${task.task}"`).join(", ");
        toast.warning(`Today is the Deadline of ${taskNames}`);
      }
      if (dueTasks.length === 0) {
        toast.info(`Today is not the Deadline of any Task`);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="w-[500px] shadow-lg p-10">
        <form className="flex flex-col text-md gap-1" onSubmit={handleSubmit}>
          <h1 className="text-center text-2xl font-semibold mb-4">Login</h1>
          <CustomInputField
            name="Email"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomInputField
            name="Password"
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black text-white p-2 rounded mt-5"
          >
            Login
          </button>
          <p className="text-center pt-2">
            Dont have an Account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
