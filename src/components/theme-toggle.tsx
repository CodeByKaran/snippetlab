import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { SunMoon } from "lucide-react";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <SunMoon />
    </Button>
  );
};

export default ThemeToggle;
