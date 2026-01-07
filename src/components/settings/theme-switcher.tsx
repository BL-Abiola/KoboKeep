'use client';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { name: 'light', icon: Sun },
    { name: 'dark', icon: Moon },
    { name: 'system', icon: Laptop },
  ];

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-muted p-1">
      {themes.map((t) => (
        <Button
          key={t.name}
          variant={theme === t.name ? 'default' : 'ghost'}
          size="sm"
          className="w-full capitalize"
          onClick={() => setTheme(t.name)}
        >
          <t.icon className="mr-2 h-4 w-4" />
          {t.name}
        </Button>
      ))}
    </div>
  );
}
