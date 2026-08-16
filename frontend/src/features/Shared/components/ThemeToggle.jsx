import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../state/theme.slice";

const ThemeToggle = ({ className = "" }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme?.mode || "light");
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer overflow-hidden group shadow-sm ${
        isDark
          ? "bg-[#161412] border-[#38332e] text-[#C9A96E] hover:border-[#C9A96E]"
          : "bg-[#f5f3f0] border-[#e4e2df] text-[#0d0d0b] hover:border-[#C9A96E]"
      } ${className}`}
    >
      {/* Sun Icon (shown in dark mode to switch to light) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className={`w-4 h-4 absolute transition-all duration-500 transform ${
          isDark
            ? "rotate-0 scale-100 opacity-100 text-[#C9A96E]"
            : "-rotate-90 scale-0 opacity-0 text-[#0d0d0b]"
        }`}
      >
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        />
      </svg>

      {/* Moon Icon (shown in light mode to switch to dark) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className={`w-4 h-4 absolute transition-all duration-500 transform ${
          isDark
            ? "rotate-90 scale-0 opacity-0 text-[#C9A96E]"
            : "rotate-0 scale-100 opacity-100 text-[#0d0d0b]"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    </button>
  );
};

export default ThemeToggle;
