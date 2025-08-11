import { Sun, Moon, Home, Mail, Github, Instagram } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Toggle } from "@/components/ui/toggle";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur bg-white/70 dark:bg-black/70 border border-gray-200 dark:border-gray-800 rounded-full shadow-lg px-6 py-3 transition-all w-auto">
      <nav className="flex items-center justify-between gap-6">
        {/* Home link on the left */}
        <a
          href="/"
          className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Home className="w-5 h-5" />
        </a>

        {/* Spacer */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

        {/* Right nav icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/khaledhussein957"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/khaledhussein957"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="mailto:khaledhussein957@gmail.com"
            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
        {/* Spacer */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

        <Toggle
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition relative"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Toggle>
      </nav>
    </header>
  );
};

export default Header;
