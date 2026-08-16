import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("luxurisen_theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

const applyThemeToDOM = (theme) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    document.body?.classList.add("dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    document.body?.classList.remove("dark");
  }
  localStorage.setItem("luxurisen_theme", theme);
};

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: initialTheme, // "light" | "dark"
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      applyThemeToDOM(state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      applyThemeToDOM(state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
