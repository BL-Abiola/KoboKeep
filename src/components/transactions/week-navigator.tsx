'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeekNavigatorProps {
  selectedDate: Date;
  onDateChange: (newDate: Date) => void;
}

export function WeekNavigator({ selectedDate, onDateChange }: WeekNavigatorProps) {
  
  const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const weekDays = eachDayOfInterval({ start, end });

  const handlePreviousWeek = () => {
    onDateChange(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    onDateChange(addWeeks(selectedDate, 1));
  };


  const formattedRange = `${format(start, 'MMMM yyyy')}`;

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold font-headline text-lg">{formattedRange}</h3>
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => (
            <button key={day.toISOString()} onClick={() => onDateChange(day)} className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors h-16 w-full",
                isSameDay(day, selectedDate) 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-accent hover:text-accent-foreground"
            )}>
                <span className="text-xs uppercase font-light">{format(day, 'E')}</span>
                <span className="text-lg font-bold">{format(day, 'd')}</span>
            </button>
        ))}
      </div>
    </div>
  );
}
