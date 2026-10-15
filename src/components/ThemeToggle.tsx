import { Moon, Sun } from 'lucide-react';
import { Toggle } from './ui/toggle';
import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Toggle
      pressed={theme === 'dark'}
      onPressedChange={toggleTheme}
      aria-label="切换明暗模式"
      size="sm"
      className="rounded-full"
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Toggle>
  );
}
