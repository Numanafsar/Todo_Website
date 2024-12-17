import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

export default function StickyNote() {
  const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date().toLocaleDateString("en-GB"));
    const [description, setDescription] = useState("");

    const handleAdd = async () => {
      if (!title || !description) {
        toast.error("Fields are Empty!");
        return;
      }
    
      try {
        const response = await axios.post(
          "https://todo-website-p3og.onrender.com/notes",
          { title, description, date },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
    
        const noteId = response.data._id; 
        await axios.post(
          "https://todo-website-p3og.onrender.com/add-note",
          { noteId },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setTitle("");
        setDescription("");
        window.location.reload();
        toast.success("Note added successfully!");
      } catch (error) {
        console.error("Error adding note:", error);
        toast.error("Error adding note.");
      }
    };
    
  return (
    <div >
      <h1 className="text-xl font-serif font-medium ">Title</h1>
      <input type="text" name="title" id="title" value={title} className="border  p-1 w-full mb-2" onChange={(e) => setTitle(e.target.value)}/>
      <h1 className="text-xl font-serif font-medium ">Description</h1>
      <textarea name="description" id="description" cols="30" rows="10" value={description} className="border  p-1 w-full mb-2" onChange={(e) => setDescription(e.target.value)}/>
      <button type="button" className="bg-[#3182aa] text-white mb-2 px-3 py-1 rounded" onClick={handleAdd}>Submit</button>
    </div>
  )
}
