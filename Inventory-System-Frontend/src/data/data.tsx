
import type { Item, Order, ActivityLog, AvailableItem, OrderItem } from '@/types';

//Category
export const categoryData: any[] = [];

// Mock data for stock levels
export const stockData: any[] = [];

// Mock data
export const mockItems: Item[] = [];

//Mock orders
export const mockOrders: Order[] = [];

//ReportsData
export const topSellingItems: any[] = [];

export const topCustomers: any[] = [];

export const inventoryData: any[] = [];

export const salesTransactionData: any[] = [];

export const salesData: any[] = [];

// Mock item data for selection
export const availableItems: AvailableItem[] = [];

//History
// Mock activity log data
export const activityLogs: ActivityLog[] = [];

// Mock detailed item data
export const mockItemDetails: Item = {
  id: 0,
  name: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  status: 'Out of Stock',
  sku: '',
  dimensions: '',
  weight: '',
  manufacturer: '',
  location: '',
  dateAdded: '',
  lastUpdated: '',
};

// Mock invoice data
export const mockInvoiceItems: OrderItem[] = [];

// Mock data for sales trends
export const weeklyData: any[] = [];

export const monthlyData: any[] = [];
