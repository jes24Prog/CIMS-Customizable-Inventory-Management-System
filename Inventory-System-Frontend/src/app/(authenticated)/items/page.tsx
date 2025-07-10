
'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ItemsTable from '@/components/ItemsTable';
import { Plus, Eye, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddItemForm from '@/components/forms/AddItemForm';
import type { Item } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { itemsRepository } from '@/lib/items-repository';

const ItemsPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const handleDataChange = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const viewItemDetails = (itemId: number) => {
    setOpenDetailDialog(true);
    setIsDetailLoading(true);
    setSelectedItem(null);
    try {
      const data = itemsRepository.getById(itemId);
      if (!data) throw new Error('Failed to fetch item details.');
      setSelectedItem(data);
    } catch (error) {
      console.error(error);
      setOpenDetailDialog(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Items</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory items
          </p>
        </div>
        <Button 
          className="btn-hover-effect w-full sm:w-auto"
          onClick={() => setOpenAddItemDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <ItemsTable key={dataVersion} onViewDetails={viewItemDetails} onDataChange={handleDataChange} />

      <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Item Details</span>
              <Button variant="ghost" size="icon" onClick={() => setOpenDetailDialog(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              View detailed information about this inventory item
            </DialogDescription>
          </DialogHeader>
          {isDetailLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                <Card>
                  <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-12 w-full" />
                    <div className="space-y-2 pt-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                  </CardContent>
                </Card>
             </div>
          ) : selectedItem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                    <p className="text-muted-foreground mt-1">{selectedItem.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{selectedItem.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span>{selectedItem.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span>PHP {selectedItem.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="default">{selectedItem.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock Level:</span>
                      <span>{selectedItem.stock} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-right">{selectedItem.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date Added:</span>
                      <span>{selectedItem.dateAdded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{selectedItem.lastUpdated}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span>{selectedItem.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span>{selectedItem.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manufacturer:</span>
                      <span>{selectedItem.manufacturer}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2 flex gap-3 justify-end">
                <Button variant="outline">Edit Item</Button>
                <Button variant="outline">Update Stock</Button>
                <Button>
                  <Eye className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">No item details found.</div>
          )}
        </DialogContent>
      </Dialog>

      <AddItemForm
        open={openAddItemDialog}
        onOpenChange={setOpenAddItemDialog}
        onSuccess={handleDataChange}
      />
    </div>
  );
};

export default ItemsPage;
