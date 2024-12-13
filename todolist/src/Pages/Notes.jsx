import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import StickyNote from "../Components/StickyNote";
import axios from "axios";
import {BsFillTrashFill} from 'react-icons/bs';

export default function Notes() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isModelEdit, setIsModelEdit] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [updatedNote, setUpdatedNote] = useState({
    title: "",
    description: "",
  });
  const [notes, setNotes] = useState([]);

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleAdd = () => {
    setIsModelOpen(true);
  };
  const handleEdit = async (noteId) => {
    setIsModelEdit(true); 
    try {
      const response = await axios.get("http://localhost:3001/notes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const note = response.data.find((n) => n._id === noteId);
      if (note){
        setSelectedNote(note);
        setUpdatedNote({ title: note.title, description: note.description });
      } else {
        console.error("Note not found");
      }
    } catch (error) {
      console.log("Error fetching notes:", error);
    }
  };

  const handleDelete = async (noteId) => {
    
    try {
      const noteResponse= await axios.get(`http://localhost:3001/notes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (noteResponse.data.find((n) => n._id === noteId)) {
        await axios.delete(`http://localhost:3001/notes/${noteId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const updatedNotes = await axios.get("http://localhost:3001/notes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setNotes(updatedNotes.data);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleUpdate = async () => {
  
    if (!updatedNote.title || !updatedNote.description) {
      console.error("Note title and description are required");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3001/notes/${selectedNote._id}`,
        updatedNote,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Note updated:", response.data);
      setIsModelEdit(false);
  
      const updatedNotes = await axios.get("http://localhost:3001/notes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(updatedNotes.data);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/notes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(response.data); 
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };
  
  useEffect(() => {
    fetchNotes();
  }, [isModelOpen]);
  return (
    <div className="w-full flex">
      <div className="w-full mx-[5%]">
        <div className="flex flex-wrap max-md:justify-center gap-4 pt-[30px] md:pt-[100px]">
          {notes.map((note, index) => (
            <div
              key={note._id}
              className="w-[250px] h-[250px] p-4 shadow-md rounded bg-gray-50 hover:shadow-lg transition"
            >
              <div className="flex justify-end gap-3 mb-2">
              <button
                  className="bg-[#3182aa] text-white px-3 rounded-md"
                  onClick={() => handleEdit(note._id)}
                >
                  Edit
                </button>
                <button className="text-red-300" onClick={() => handleDelete(note._id)}><BsFillTrashFill /></button>
              </div>
              <h2 className="text-lg font-semibold ">{note.title}</h2>
              <p className="text-sm mt-2 text-gray-600">{note.description}</p>
            </div>
          ))}

          <div
            onClick={handleAdd}
            className="w-[250px] h-[250px] flex items-center justify-center border p-4 shadow-md rounded bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
          >
            <span className=" text-xl font-bold text-gray-700">+ Add New</span>
          </div>
        </div>
      </div>

      {isModelOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center">
          <div className="bg-white p-10 rounded shadow-lg w-[40%]">
            <StickyNote />
            <button
              onClick={() => setIsModelOpen(false)}
              className="mt-1 bg-red-500 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isModelEdit && selectedNote && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center">
          <div className="bg-white p-10 rounded shadow-lg w-[40%]">
            <h2 className="text-xl font-semibold mb-4">Edit Note</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={updatedNote.title}
                onChange={(e) =>
                  setUpdatedNote({ ...updatedNote, title: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full border p-2 rounded"
                value={updatedNote.description}
                onChange={(e) =>
                  setUpdatedNote({
                    ...updatedNote,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModelEdit(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}