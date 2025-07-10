
import type React from 'react';

// Main Data Structures
export interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  description?: string;
  sku?: string;
  dimensions?: string;
  weight?: string;
  manufacturer?: string;
  location?: string;
  dateAdded: string;
  lastUpdated: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ActivityLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
    category: 'inventory' | 'order' | 'user' | 'system' | 'category';
}

export interface AvailableItem {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface CompanyProfile {
  name: string;
  address: string;
  phone: string;
}

// Context
export interface User {
  username: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Component Props
export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

export interface ItemsTableProps {
  onViewDetails?: (itemId: number) => void;
  onDataChange?: () => void;
}

export interface SalesChartProps {
  className?: string;
}

export type TimeRange = 'weekly' | 'monthly';

export interface StockChartProps {
  className?: string;
}

export interface AddItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface CreateOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: () => void;
}

export interface EditItemFormProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface UpdateStockFormProps {
  item: {
    id: number;
    name: string;
    stock: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface InvoiceProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface AddCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface EditCategoryFormProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: () => void;
}
