'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { CURRENCIES } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyChartProps {
  data: Transaction[];
}

export function DailyChart({ data }: DailyChartProps) {
  const { settings } = useAppStore();
  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';

  const chartData = React.useMemo(() => {
    const hourlyData: { [hour: string]: { sales: number; expenses: number } } = {};

    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      hourlyData[hour] = { sales: 0, expenses: 0 };
    }

    data.forEach((transaction) => {
      const hour = new Date(transaction.date).getHours();
      const hourString = hour.toString().padStart(2, '0') + ':00';
      if (transaction.type === 'sale') {
        hourlyData[hourString].sales += transaction.amount;
      } else {
        hourlyData[hourString].expenses += transaction.amount;
      }
    });

    return Object.entries(hourlyData).map(([hour, values]) => ({
      hour,
      ...values,
    })).filter(d => d.sales > 0 || d.expenses > 0);
  }, [data]);
  
    if (chartData.length === 0) {
        return <div className="text-center text-muted-foreground p-8">No transaction data yet for today to display the chart.</div>
    }


  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
