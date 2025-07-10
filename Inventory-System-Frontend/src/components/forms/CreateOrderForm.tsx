
'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Minus, Trash2 } from 'lucide-react';
import type { OrderItem, CreateOrderFormProps, AvailableItem } from '@/types';
import { itemsRepository } from '@/lib/items-repository';
import { ordersRepository } from '@/lib/orders-repository';

const formSchema = z.object({
  customer: z.string().min(2, { message: 'Customer name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export default function CreateOrderForm({ open, onOpenChange, onOrderCreated }: CreateOrderFormProps) {
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [availableItems, setAvailableItems] = useState<AvailableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      const fetchItems = () => {
        setIsLoading(true);
        try {
          const data = itemsRepository.getAll();
          setAvailableItems(data);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchItems();
    }
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  const addItemToOrder = () => {
    if (!selectedItemId) return;
    
    const itemToAdd = availableItems.find(item => item.id === selectedItemId);
    if (!itemToAdd) return;
    
    const existingItem = selectedItems.find(item => item.id === selectedItemId);
    
    if (existingItem) {
      setSelectedItems(items =>
        items.map(item =>
          item.id === selectedItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...itemToAdd, quantity: 1 }]);
    }
    
    setSelectedItemId(null);
  };

  const updateItemQuantity = (id: number, change: number) => {
    setSelectedItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setSelectedItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedItems.length === 0) {
      toast.error('Please add at least one item to the order');
      return;
    }

    try {
      ordersRepository.create({
        customer: values.customer,
        items: selectedItems,
      });

      toast.success('Order created successfully');
      form.reset();
      setSelectedItems([]);
      onOpenChange(false);
      if (onOrderCreated) onOrderCreated();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Enter customer information and select items for this order.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="customer@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+63 123 456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <div className="font-medium">Order Items</div>
              <div className="flex space-x-2">
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedItemId || ''}
                  onChange={(e) => setSelectedItemId(Number(e.target.value))}
                  disabled={isLoading}
                >
                  <option value="">{isLoading ? 'Loading items...' : 'Select an item'}</option>
                  {availableItems.map(item => (
                    <option key={item.id} value={item.id} disabled={item.stock === 0}>
                      {item.name} - PHP {item.price.toFixed(2)} ({item.stock} in stock)
                    </option>
                  ))}
                </select>
                <Button 
                  type="button" 
                  onClick={addItemToOrder} 
                  disabled={!selectedItemId}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {selectedItems.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">PHP {item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => updateItemQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => updateItemQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            PHP {(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          PHP {calculateTotal().toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground border rounded-md">
                  No items added to this order
                </div>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Special instructions or notes for this order" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Order</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
