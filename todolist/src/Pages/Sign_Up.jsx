import { useState } from "react";
import CustomInputField from "../Components/CustomInputField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Sign_Up() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:3001/signup", {
        name,
        email,
        password,
        Notes_id: [],
        Todos_id: [],
      });
      toast.success("Signup successful!");
      navigate("/"); 
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Email already exists"); 
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="w-[500px] shadow-lg p-10">
        <form className="flex flex-col text-md gap-1" onSubmit={handleSubmit}>
          <h1 className="text-center text-2xl font-semibold mb-4">Sign Up</h1>

          <CustomInputField
            name="Name"
            type="text"
            placeholder="Enter your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <CustomInputField
            name="Confirm Password"
            type="password"
            placeholder="Enter your Password Again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black text-white p-2 rounded mt-5"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
