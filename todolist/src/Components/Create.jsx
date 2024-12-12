import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CustomInputField from "./CustomInputField";
export default function Create() {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [priority, setPriority] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePeriod, setRecurrencePeriod] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const handleAdd = async () => {
    if (!task || !date) {
      toast.error("Both fields are required!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/add",
        {
          task: task,
          date: date,
          deadlineDate: deadlineDate,
          priority: priority,
          isRecurring: isRecurring,
          recurrencePeriod: recurrencePeriod,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const todoId = response.data._id;
      await axios.post(
        "http://localhost:3001/add-todo",
        { todoId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Error adding todo");
    }
  };
  return (
    <div className=" py-4 border shadow-lg bg-gray-200 rounded-md px-4 mb-5">
      <CustomInputField
        name="Task"
        type="text"
        placeholder="Enter Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <CustomInputField
        name="Date"
        type="date"
        value={date}
        id="date"
        min={today}
        onChange={(e) => setDate(e.target.value)}
      />
      <CustomInputField
        name="Deadline"
        type="date"
        value={deadlineDate}
        id="date"
        min={today}
        onChange={(e) => setDeadlineDate(e.target.value)}
      />
      <label htmlFor="priority" className="rounded-sm mr-4">
        Priority Level
      </label>
      <select
        id="priority"
        name="Priority Level"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border py-1 px-1 rounded my-2 mr-4"
      >
        <option value="">Select Priority Level</option>
        <option value="Urgent & Important">Urgent & Important</option>
        <option value="Important but Not Urgent">
          Important but Not Urgent
        </option>
        <option value="Urgent but Not Important">
          Urgent but Not Important
        </option>
        <option value="Low Priority">Low Priority</option>
      </select>

      <div >
        <label className="mr-5">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)} 
            className="mr-1"
          />
          Recurring Task
        </label>

        {isRecurring && (
          <select
            value={recurrencePeriod}
            onChange={(e) => setRecurrencePeriod(e.target.value)}
            className="rounded"
          >
            <option value="">Select Recurrence Period</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        )}
      </div>

      <button
        type="button"
        className="bg-[#2a8b54] text-white my-2 px-5 py-1 rounded"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
}
