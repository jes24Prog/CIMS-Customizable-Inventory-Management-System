
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { StockChartProps } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { chartsRepository } from '@/lib/charts-repository';

const StockChart: React.FC<StockChartProps> = ({ className }) => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        const data = chartsRepository.getStock();
        setStockData(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-md shadow-md p-3 text-sm">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Stocks</CardTitle>
        <CardDescription>
          Current stock distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stockData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                iconType="circle"
                wrapperStyle={{ paddingTop: 15 }}
              />
              <Bar
                dataKey="total"
                name="In Stock"
                stackId="a"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="lowStock"
                name="Low Stock"
                stackId="a"
                fill="hsl(var(--muted-foreground))"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="outOfStock"
                name="Out of Stock"
                stackId="a"
                fill="hsl(var(--destructive))"
                radius={[0, 0, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
