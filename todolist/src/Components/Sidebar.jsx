import { FiX } from "react-icons/fi";
import { LuListTodo } from "react-icons/lu";
import { CgNotes } from "react-icons/cg";
import { Link } from "react-router-dom";

export default function Sidebar({ toggleSidebar, isOpen }) {
  return (
    <div
      className={`fixed top-0 left-0 min-h-screen transform transition-transform duration-300 ease-in-out z-50 w-64 h-full bg-gray-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }   md:translate-x-0 `}
    >
      <div className="flex justify-between p-[17px] pl-5 border-gray-700 shadow">
      <h1 className="text-xl font-serif font-semibold italic text-gray-800">
          Todo List
        </h1>
        <button
          onClick={toggleSidebar}
          className="text-2xl hover:text-gray-400"
        >
          <FiX />
        </button>
      </div>
      <div>
        <ul className="mt-14 space-y-4 px-4 text-lg">
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 hover:text-green-400 transition-colors"
            >
              <LuListTodo />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/notes"
              className="flex items-center gap-2 hover:text-green-400 transition-colors"
            >
              <CgNotes />
              Notes
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
