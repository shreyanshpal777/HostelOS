import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 transition ${className}`}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}