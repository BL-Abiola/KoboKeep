'use client';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <div className="flex items-center space-x-1 rounded-lg bg-muted p-1">
      <TooltipProvider>
        {themes.map((t) => (
          <Tooltip key={t.name}>
            <TooltipTrigger asChild>
              <Button
                variant={theme === t.name ? 'default' : 'ghost'}
                size="sm"
                className="w-full capitalize"
                onClick={() => setTheme(t.name)}
              >
                <t.icon className="h-5 w-5" />
                <span className="sr-only">{t.name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="capitalize">{t.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
