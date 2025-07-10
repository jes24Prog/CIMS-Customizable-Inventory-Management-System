
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SalesChartProps, TimeRange } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { chartsRepository } from '@/lib/charts-repository';

const SalesChart: React.FC<SalesChartProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [showOrders, setShowOrders] = useState(true);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        const chartData = chartsRepository.getSales(timeRange);
        setData(chartData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);


  const formatYAxisTick = (value: number) => {
    if (value >= 1000) {
      return `₱${(value / 1000).toFixed(0)}k`;
    }
    return `₱${value.toLocaleString()}`;
  };

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
              <span className="text-muted-foreground">
                {entry.name === 'sales' ? 'Sales:' : 'Orders:'}
              </span>
              <span className="font-medium">
                {entry.name === 'sales' ? `₱${entry.value.toLocaleString()}` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Sales</CardTitle>
          <CardDescription>
            {timeRange === 'weekly' ? 'Weekly' : 'Monthly'} sales and order performance
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value as TimeRange)}>
            <ToggleGroupItem value="weekly" aria-label="Weekly view">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="monthly" aria-label="Monthly view">Monthly</ToggleGroupItem>
          </ToggleGroup>
          <Button 
            variant={showOrders ? "default" : "outline"} 
            size="sm" 
            onClick={() => setShowOrders(!showOrders)}
            className="ml-0 sm:ml-2"
          >
            {showOrders ? "Hide Orders" : "Show Orders"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  tickFormatter={formatYAxisTick}
                />
                {showOrders && (
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                )}
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 15 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                {showOrders && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="hsl(var(--secondary-foreground))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
