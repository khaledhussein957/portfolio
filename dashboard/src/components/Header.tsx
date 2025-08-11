import { Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

const Header = ({ title, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg flex items-center gap-4 px-6 py-3">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white select-none">
        {title}
      </h1>
    </header>
  );
};

export default Header;
