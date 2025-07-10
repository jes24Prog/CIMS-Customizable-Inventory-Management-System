
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, AlertCircle, ShoppingCart } from 'lucide-react';
import type { StatCardProps } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { statsRepository } from '@/lib/stats-repository';

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive = true, icon }) => {
  return (
    <Card className="card-hover border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {change && (
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
            <span className={`mr-1 ${isPositive ? 'rotate-0' : 'rotate-180'}`}>
              <TrendingUp size={14} />
            </span>
            {change} {isPositive ? 'increase' : 'decrease'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalStockItems: 0,
    lowStockItems: 0,
    ordersPending: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(() => {
    setIsLoading(true);
    try {
      const data = statsRepository.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const handleStorageChange = () => {
      fetchStats();
    };
    
    // Add event listeners for our custom storage events
    window.addEventListener('cims-items-storage', handleStorageChange);
    window.addEventListener('cims-orders-storage', handleStorageChange);

    return () => {
      // Clean up event listeners
      window.removeEventListener('cims-items-storage', handleStorageChange);
      window.removeEventListener('cims-orders-storage', handleStorageChange);
    };
  }, [fetchStats]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        title="Total Stock Items"
        value={stats.totalStockItems.toString()}
        icon={<Package size={18} />}
      />
      <StatCard
        title="Low Stock Items"
        value={stats.lowStockItems.toString()}
        isPositive={stats.lowStockItems === 0}
        icon={<AlertCircle size={18} />}
      />
      <StatCard
        title="Orders Pending"
        value={stats.ordersPending.toString()}
        icon={<ShoppingCart size={18} />}
      />
      <StatCard
        title="Total Revenue"
        value={`Php ${stats.totalRevenue.toLocaleString()}`}
        icon={<TrendingUp size={18} />}
      />
    </div>
  );
};

export default DashboardStats;
