
'use client';
import { mockItems } from '@/data/data';
import type { Item } from '@/types';
import { activityLogsRepository } from './activity-logs-repository';

const LOCAL_STORAGE_KEY = 'cims_items';

const getItemsFromStorage = (): Item[] => {
    if (typeof window === 'undefined') {
        return mockItems; // Return mock data during SSR
    }
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedItems) {
        try {
            return JSON.parse(storedItems);
        } catch (e) {
            console.error("Failed to parse items from localStorage", e);
            return mockItems; // Fallback to mock data
        }
    }
    return mockItems; // Default mock data if nothing in storage
};

const saveItemsToStorage = (items: Item[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        window.dispatchEvent(new Event('cims-items-storage'));
    }
};

// Initialize storage if it's empty
if (typeof window !== 'undefined' && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
    saveItemsToStorage(mockItems);
}

let items: Item[] = getItemsFromStorage();
let nextId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;

export const itemsRepository = {
    getAll: (): Item[] => {
        items = getItemsFromStorage();
        return items;
    },
    getById: (id: number): Item | undefined => {
        items = getItemsFromStorage();
        return items.find(item => item.id === id);
    },
    create: (newItemData: Omit<Item, 'id' | 'status' | 'dateAdded' | 'lastUpdated'>): Item => {
        items = getItemsFromStorage();
        const newItem: Item = {
            id: nextId++,
            ...newItemData,
            price: Number(newItemData.price),
            stock: Number(newItemData.stock),
            status: Number(newItemData.stock) > 10 ? 'In Stock' : (Number(newItemData.stock) > 0 ? 'Low Stock' : 'Out of Stock'),
            dateAdded: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0],
        };
        items.push(newItem);
        saveItemsToStorage(items);
        activityLogsRepository.add({ user: 'Admin', action: 'Item Added', details: `Added new item: ${newItem.name}`, category: 'inventory' });
        return newItem;
    },
    update: (id: number, updatedItemData: Partial<Omit<Item, 'id'>>): Item | undefined => {
        items = getItemsFromStorage();
        const itemIndex = items.findIndex(item => item.id === id);
        if (itemIndex === -1) return undefined;
        
        const price = updatedItemData.price ? Number(updatedItemData.price) : items[itemIndex].price;
        const stock = updatedItemData.stock ? Number(updatedItemData.stock) : items[itemIndex].stock;
        const status = stock > 10 ? 'In Stock' : (stock > 0 ? 'Low Stock' : 'Out of Stock');

        const updatedItem: Item = {
            ...items[itemIndex],
            ...updatedItemData,
            price,
            stock,
            status,
            lastUpdated: new Date().toISOString().split('T')[0],
        };

        items[itemIndex] = updatedItem;
        saveItemsToStorage(items);
        activityLogsRepository.add({ user: 'Admin', action: 'Item Updated', details: `Updated details for item: ${updatedItem.name}`, category: 'inventory' });
        return updatedItem;
    },
    updateStock: (id: number, { quantity, operation }: { quantity: number; operation: 'add' | 'remove' }): Item | undefined => {
        items = getItemsFromStorage();
        const itemIndex = items.findIndex(item => item.id === id);
        if (itemIndex === -1) return undefined;
    
        const currentStock = items[itemIndex].stock;
        const newStock = operation === 'add' ? currentStock + quantity : Math.max(0, currentStock - quantity);
        const newStatus = newStock > 10 ? 'In Stock' : (newStock > 0 ? 'Low Stock' : 'Out of Stock');
        
        items[itemIndex].stock = newStock;
        items[itemIndex].status = newStatus;
        items[itemIndex].lastUpdated = new Date().toISOString().split('T')[0];
    
        saveItemsToStorage(items);
        activityLogsRepository.add({ user: 'Admin', action: 'Stock Update', details: `${operation === 'add' ? 'Added' : 'Removed'} ${quantity} units for ${items[itemIndex].name}`, category: 'inventory' });
        return items[itemIndex];
    },
    delete: (id: number): boolean => {
        items = getItemsFromStorage();
        const itemToDelete = items.find(item => item.id === id);
        if (!itemToDelete) return false;

        const initialLength = items.length;
        items = items.filter(item => item.id !== id);
        saveItemsToStorage(items);

        if(items.length < initialLength) {
            activityLogsRepository.add({ user: 'Admin', action: 'Item Deleted', details: `Deleted item: ${itemToDelete.name}`, category: 'inventory' });
            return true;
        }
        return false;
    },
};
