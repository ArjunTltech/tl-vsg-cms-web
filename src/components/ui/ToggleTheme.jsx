import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ToggleTheme() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const localTheme = localStorage.getItem('theme');
    document.querySelector('html').setAttribute('data-theme', localTheme);
  }, [theme]);

  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <div>
      <label className="swap swap-rotate ml-3">
        <input
          type="checkbox"
          onChange={handleToggle}
          checked={theme === 'dark'}
        />
        {/* Dark Theme Icon (Moon) */}
        <Moon className="swap-on fill-current w-10 h-10" />
        {/* Light Theme Icon (Sun) */}
        <Sun className="swap-off fill-current w-10 h-10 text-neutral-content" />
      </label>
    </div>
  );
}
