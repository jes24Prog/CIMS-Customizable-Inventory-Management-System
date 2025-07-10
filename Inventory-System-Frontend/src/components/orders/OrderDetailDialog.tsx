
import React from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Order, OrderDetailDialogProps } from '@/types';
import { ordersRepository } from '@/lib/orders-repository';

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  order,
  open,
  onOpenChange,
  onStatusChange,
}) => {
  if (!order) return null;

  const handleStatusChange = (newStatus: Order['status']) => {
    try {
      ordersRepository.updateStatus(order.id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status.");
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Viewing details for order #{order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-muted-foreground">Customer</h3>
              <p>{order.customer}</p>
            </div>
            <div>
              <h3 className="font-semibold text-muted-foreground">Order Date</h3>
              <p>{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-muted-foreground">Status</h3>
              {getStatusBadge(order.status)}
            </div>
             <div>
              <h3 className="font-semibold text-muted-foreground">Order Total</h3>
              <p>PHP {order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Items Ordered</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(order.items) && order.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">PHP {item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">PHP {(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Update Status</h3>
            <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(value as Order['status'])}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
