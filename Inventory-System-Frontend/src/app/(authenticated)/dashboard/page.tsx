'use client'
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardStats from "@/components/DashboardStats";
import ItemsTable from "@/components/ItemsTable";
import StockChart from "@/components/charts/StockChart";
import SalesChart from "@/components/charts/SalesChart";
import { itemsRepository } from "@/lib/items-repository";
import type { Item } from "@/types";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = () => {
      try {
        setItems(itemsRepository.getAll());
      } catch (error) {
        console.error("Failed to fetch items for dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();

    const handleStorageChange = () => {
      fetchItems();
    };

    window.addEventListener('cims-items-storage', handleStorageChange);
    return () => {
      window.removeEventListener('cims-items-storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">CIMS Statistics</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <StockChart />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Items</h2>
        {isLoading ? (
          <p>Loading items...</p>
        ) : items.length > 0 ? (
          <ItemsTable />
        ) : (
          <div className="text-center py-10 text-muted-foreground border rounded-lg">
             No recent items to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
