import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
export default function Header({ isSideBarOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("token");
  };
  return (
    <div className="fixed top-0 left-0 w-full px-4 flex justify-between items-center bg-[#BCE7FC] py-4">
      <div className="flex gap-6">
      {!isSideBarOpen && (
          <button
            onClick={toggleSidebar}
            className="text-2xl text-gray-700 hover:text-gray-900"
          >
            <FiMenu />
          </button>
        )}
        <h1 className="text-xl font-serif font-semibold italic text-gray-800">
          Todo List
        </h1>
      </div>
      <button
        className="bg-black text-white px-3 py-1 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
