'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { CURRENCIES } from '@/lib/constants';
import { format } from 'date-fns';

interface WeeklyChartProps {
  data: Transaction[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const { settings } = useAppStore();
  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';

  const chartData = React.useMemo(() => {
    const weeklyData: { [day: string]: { sales: number; expenses: number } } = {
        'Mon': { sales: 0, expenses: 0 },
        'Tue': { sales: 0, expenses: 0 },
        'Wed': { sales: 0, expenses: 0 },
        'Thu': { sales: 0, expenses: 0 },
        'Fri': { sales: 0, expenses: 0 },
        'Sat': { sales: 0, expenses: 0 },
        'Sun': { sales: 0, expenses: 0 },
    };

    data.forEach((transaction) => {
      const day = format(new Date(transaction.date), 'E'); // E gives short day name e.g., 'Mon'
      if (weeklyData[day]) {
        if (transaction.type === 'sale') {
          weeklyData[day].sales += transaction.amount;
        } else {
          weeklyData[day].expenses += transaction.amount;
        }
      }
    });

    return Object.entries(weeklyData).map(([day, values]) => ({
      day,
      ...values,
    }));
  }, [data]);
  
    if (data.length === 0) {
        return <div className="text-center text-muted-foreground p-8">No transaction data yet for this week to display the chart.</div>
    }


  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `${currencySymbol}${value}`}
          />
          <Tooltip
            cursor={{ fill: 'hsla(var(--accent))' }}
            contentStyle={{ 
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
            formatter={(value: number) => `${currencySymbol}${value.toFixed(2)}`}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }}/>
          <Bar dataKey="sales" fill="hsl(var(--primary))" name="Sales" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
