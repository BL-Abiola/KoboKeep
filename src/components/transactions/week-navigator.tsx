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
    <div className="rounded-lg border bg-card text-card-foreground p-3 shadow-lg">
      <div className="flex items-center justify-center mb-3">
        <h3 className="font-semibold font-headline text-md text-center">{formattedRange}</h3>
      </div>
      <div className="flex items-center justify-between gap-1">
        <Button variant="outline" size="icon" onClick={handlePreviousWeek} className="h-9 w-9">
            <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="grid grid-cols-7 gap-1 w-full">
            {weekDays.map(day => (
                <button key={day.toISOString()} onClick={() => onDateChange(day)} className={cn(
                    "flex flex-col items-center justify-center p-1 rounded-lg transition-colors h-14 w-full",
                    isSameDay(day, selectedDate) 
                        ? "bg-primary text-primary-foreground shadow" 
                        : "hover:bg-accent hover:text-accent-foreground"
                )}>
                    <span className="text-[10px] uppercase font-light">{format(day, 'E')}</span>
                    <span className="text-md font-bold">{format(day, 'd')}</span>
                </button>
            ))}
        </div>
        <Button variant="outline" size="icon" onClick={handleNextWeek} className="h-9 w-9">
            <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
