import { useSelector, useDispatch } from "react-redux";
import { toggleTheme as toggleThemeAction, setTheme as setThemeAction } from "../state/theme.slice";

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme?.mode || "light");
  const isDark = theme === "dark";

  const toggleTheme = () => dispatch(toggleThemeAction());
  const setTheme = (mode) => dispatch(setThemeAction(mode));

  return { theme, isDark, toggleTheme, setTheme };
};
