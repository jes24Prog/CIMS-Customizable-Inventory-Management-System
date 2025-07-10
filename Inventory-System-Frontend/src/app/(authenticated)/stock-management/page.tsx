
'use client'
import React, { useState, useEffect } from 'react';
import StockChart from '@/components/charts/StockChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { reportsRepository } from '@/lib/reports-repository';

const getUtilizationColor = (utilization: number) => {
  if (utilization < 40) return 'bg-blue-500';
  if (utilization < 70) return 'bg-green-500';
  if (utilization < 90) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Low':
      return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Low</Badge>;
    case 'Normal':
      return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Normal</Badge>;
    case 'High':
      return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">High</Badge>;
    case 'Critical':
      return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Critical</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const StockManagementPage: React.FC = () => {
  const [stockUtilization, setStockUtilization] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockUtilization = () => {
      setIsLoading(true);
      try {
        const data = reportsRepository.getStockUtilization();
        setStockUtilization(data.categoryData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStockUtilization();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage your inventory levels
        </p>
      </div>

      <StockChart className="w-full" />

      <Tabs defaultValue="categories" className="w-full">
        <TabsList>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="locations">By Location</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Utilization</CardTitle>
              <CardDescription>
                Current utilization per category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2 py-2">
                       <div className="flex justify-between items-center">
                         <Skeleton className="h-5 w-1/4" />
                         <Skeleton className="h-6 w-1/5" />
                       </div>
                       <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between items-center">
                         <Skeleton className="h-5 w-1/3" />
                         <Skeleton className="h-8 w-1/4" />
                       </div>
                       { i < 4 && <Separator className="mt-4" />}
                    </div>
                  ))
                ) : stockUtilization.map((category, index) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{category.items}/{category.capacity} items</span>
                        {getStatusBadge(category.status)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress
                        value={category.utilization}
                        className={`h-2 flex-1`}
                        indicatorClassName={getUtilizationColor(category.utilization)}
                      />
                      <span className="text-sm font-medium w-14 text-right">{category.utilization}%</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-sm">
                      <span className="text-muted-foreground">Value: {category.value.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}</span>
                      <div className="flex gap-4">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                          <ArrowDownIcon className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                    {index < stockUtilization.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="locations" className="mt-4">
          <Card className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground">Location-based stock management coming soon</p>
          </Card>
        </TabsContent>
        <TabsContent value="alerts" className="mt-4">
          <Card className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground">Stock alerts coming soon</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockManagementPage;
