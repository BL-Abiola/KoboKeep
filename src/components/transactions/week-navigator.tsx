'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

interface WeekNavigatorProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

export function WeekNavigator({ currentDate, onDateChange }: WeekNavigatorProps) {
  const handlePreviousWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };

  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });

  const formattedRange = `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card text-card-foreground p-3 shadow-sm">
      <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-center font-semibold">
        <p>{formattedRange}</p>
      </div>
      <Button variant="outline" size="icon" onClick={handleNextWeek}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
