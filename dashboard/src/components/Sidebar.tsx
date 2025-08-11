import { NavLink } from "react-router-dom";
import {
  User,
  FolderKanban,
  Lightbulb,
  LogOut,
  BarChart2,
} from "lucide-react";
import { useAuthStore } from "../stores/AuthStore";

interface SidebarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setOpen }: SidebarProps) => {
  const handleLinkClick = () => {
    if (isOpen) setOpen(false);
  };

  const { user, logout } = useAuthStore();

  const links = [
    { to: "/", label: "Overview", icon: BarChart2 },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/skills", label: "Skills", icon: Lightbulb },
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.name}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              handleLinkClick();
              handleLogout();
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-red-600 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
