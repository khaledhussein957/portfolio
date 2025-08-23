import { NavLink } from "react-router-dom";
import {
  User,
  FolderKanban,
  Lightbulb,
  LogOut,
  BarChart2,
} from "lucide-react";
import { useAuthStore } from "../stores/AuthStore";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
          <h1 className="text-xl font-bold text-black dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-white">
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
                        ? "bg-gray-100 text-black dark:bg-gray-100 dark:text-white"
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
        <div className="px-4 py-3 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-all font-medium text-gray-700 hover:bg-red-600 hover:text-white dark:text-gray-300 dark:hover:bg-red-700 focus:bg-gray-100 focus:text-black dark:focus:bg-gray-100 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              </AlertDialogHeader>
              <p>Are you sure you want to logout?</p>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleLinkClick();
                    handleLogout();
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
