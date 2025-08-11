import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar with controlled open state */}
      <Sidebar
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
      />
      <Outlet
        context={{ onToggleSidebar: () => setSidebarOpen(!isSidebarOpen) }}
      />
    </div>
  );
};

export default DashboardLayout;
