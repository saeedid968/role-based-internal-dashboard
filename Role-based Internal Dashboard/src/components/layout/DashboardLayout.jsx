import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Breadcrumbs from "../common/Breadcrumbs";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  return (
    // overflow-hidden here prevents the global body scroll
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* min-w-0 is CRITICAL here to allow the container to shrink smaller than its children */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto"> {/* Optional: limits extreme width on huge monitors */}
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
