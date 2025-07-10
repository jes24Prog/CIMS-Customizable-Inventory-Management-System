
import React from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { UpdateStockFormProps } from '@/types';
import { itemsRepository } from '@/lib/items-repository';

const formSchema = z.object({
  quantity: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Quantity must be a positive number.',
  }),
  operation: z.enum(['add', 'remove']),
  reason: z.string().min(2, { message: 'Please provide a reason for this update.' }),
});

export default function UpdateStockForm({ 
  item, 
  open, 
  onOpenChange, 
  onSuccess 
}: UpdateStockFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: '1',
      operation: 'add',
      reason: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!item) return;

    const quantity = Number(values.quantity);
    
    try {
      itemsRepository.updateStock(item.id, {
        quantity,
        operation: values.operation,
      });

      toast.success(
        values.operation === 'add'
          ? `Added ${quantity} units to inventory`
          : `Removed ${quantity} units from inventory`
      );
      
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  }

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>
            Add or remove stock for {item.name}. Current stock: {item.stock} units.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="operation"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Operation</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="add" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                          Add to stock
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="remove" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                          Remove from stock
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Restock from supplier, Customer order, Damaged items" 
                      {...field} 
                    />
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
              <Button type="submit">Update Stock</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
