import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      const isMdOrAbove = window.matchMedia("(min-width: 768px)").matches;
      setIsSideBarOpen(isMdOrAbove);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex">
      {isSideBarOpen && (
        <Sidebar toggleSidebar={toggleSidebar} isOpen={isSideBarOpen} />
      )}
      <div className="flex-1">
        <Header toggleSidebar={toggleSidebar} isSideBarOpen={isSideBarOpen} />
        <Outlet />
      </div>
    </div>
  );
}
