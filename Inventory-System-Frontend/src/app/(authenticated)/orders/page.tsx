
'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, FileText, Search, Filter, Plus, Clock, Package, CalendarIcon, MoreVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import CreateOrderForm from '@/components/forms/CreateOrderForm';
import InvoiceViewer from '@/components/orders/InvoiceViewer';
import OrderDetailDialog from '@/components/orders/OrderDetailDialog';
import type { Order, OrderItem } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ordersRepository } from '@/lib/orders-repository';

type SortKey = 'date' | 'total';
type SortDirection = 'asc' | 'desc';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'date', direction: 'desc' });

  const fetchOrders = useCallback(() => {
    setIsLoading(true);
    try {
      const data = ordersRepository.getAll();
      setOrders(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const handleStorageChange = () => {
      fetchOrders();
    };

    window.addEventListener('cims-orders-storage', handleStorageChange);
    return () => {
      window.removeEventListener('cims-orders-storage', handleStorageChange);
    };
  }, [fetchOrders]);

  const handleDataChange = () => {
    fetchOrders();
  };

  const sortedOrders = useMemo(() => {
    let sortableItems = [...orders];
    sortableItems.sort((a, b) => {
        if (sortConfig.key === 'date') {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        if (sortConfig.key === 'total') {
            return sortConfig.direction === 'asc' ? a.total - b.total : b.total - a.total;
        }
        return 0;
    });
    return sortableItems;
  }, [orders, sortConfig]);

  const filteredOrders = sortedOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
      case 'Shipped':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
      case 'Delivered':
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrderForDetail(order);
    setDetailDialogOpen(true);
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedOrderForInvoice(order);
    setInvoiceDialogOpen(true);
  };

  const getCardStat = (status: Order['status'] | 'Total') => {
      if (isLoading) return <Skeleton className="h-6 w-8" />;
      if (status === 'Total') return orders.length;
      return orders.filter(o => o.status === status).length;
  }

  const getCardTotal = () => {
     if (isLoading) return <div className="text-2xl font-bold"><Skeleton className="h-6 w-24" /></div>;
     const total = orders.reduce((sum, order) => sum + order.total, 0);
     return <div className="text-2xl font-bold">PHP {total.toLocaleString()}</div>
  }

  const handleSort = (key: SortKey, direction: SortDirection) => {
    setSortConfig({ key, direction });
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory orders
          </p>
        </div>
        <Button 
          className="w-full sm:w-auto"
          onClick={() => setCreateOrderOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Order
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <div className="text-2xl font-bold">{getCardStat('Total')}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <div className="text-2xl font-bold">{getCardStat('Processing')}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shipped</p>
                <div className="text-2xl font-bold">{getCardStat('Shipped')}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                {getCardTotal()}
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row justify-between gap-3 my-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort('date', 'desc')}>Date: Newest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('date', 'asc')}>Date: Oldest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('total', 'desc')}>Total: High to Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('total', 'asc')}>Total: Low to High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-10">
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                     [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-8 ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="text-right">
                          {Array.isArray(order.items)
                            ? order.items.reduce((sum, item) => sum + item.quantity, 0)
                            : 0}
                        </TableCell>
                        <TableCell className="text-right">PHP {order.total.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewInvoice(order)}>
                                View Invoice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardHeader className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardHeader>
          </Card>
        </TabsContent>
        
        <TabsContent value="processing" className="mt-0">
          <Card className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground">Processing orders view coming soon</p>
          </Card>
        </TabsContent>
        <TabsContent value="shipped" className="mt-0">
          <Card className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground">Shipped orders view coming soon</p>
          </Card>
        </TabsContent>
        <TabsContent value="delivered" className="mt-0">
          <Card className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground">Delivered orders view coming soon</p>
          </Card>
        </TabsContent>
        <TabsContent value="cancelled" className="mt-0">
          <Card className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground">Cancelled orders view coming soon</p>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateOrderForm
        open={createOrderOpen}
        onOpenChange={setCreateOrderOpen}
        onOrderCreated={handleDataChange}
      />

      {selectedOrderForDetail && (
        <OrderDetailDialog
          order={selectedOrderForDetail}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onStatusChange={handleDataChange}
        />
      )}

      {selectedOrderForInvoice && (
        <InvoiceViewer
          order={selectedOrderForInvoice}
          open={invoiceDialogOpen}
          onOpenChange={setInvoiceDialogOpen}
        />
      )}
    </div>
  );
};

export default OrdersPage;
