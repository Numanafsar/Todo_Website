import React,{ useState } from 'react'
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const toggleSidebar = () => {
      setIsSideBarOpen(!isSideBarOpen);
    }
  return (
    <div className="flex">
        {isSideBarOpen && (
          <Sidebar toggleSidebar={toggleSidebar} isOpen={isSideBarOpen} />  
        )}
        <div className="flex-1">
      <Header
        toggleSidebar={toggleSidebar}
        isSideBarOpen={isSideBarOpen}
      />
      <Outlet/>
      </div>
    </div>
  )
}
