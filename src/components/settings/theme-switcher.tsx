'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-full max-w-sm rounded-lg bg-muted p-1" />;
  }

  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'system', icon: Laptop, label: 'System' },
  ];

  return (
    <Tabs value={theme} onValueChange={setTheme} className="max-w-sm">
      <TabsList className="flex w-full">
        {themes.map((t) => (
          <TabsTrigger key={t.name} value={t.name} className="flex-1">
            <t.icon className="mr-2 h-4 w-4" />
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
