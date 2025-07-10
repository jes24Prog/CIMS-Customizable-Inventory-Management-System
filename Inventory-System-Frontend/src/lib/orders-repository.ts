
'use client';
import { mockOrders } from '@/data/data';
import type { Order, OrderItem } from '@/types';
import { activityLogsRepository } from './activity-logs-repository';
import { itemsRepository } from './items-repository';

const LOCAL_STORAGE_KEY = 'cims_orders';

const getOrdersFromStorage = (): Order[] => {
    if (typeof window === 'undefined') {
        return mockOrders; // Return mock data during SSR
    }
    const storedOrders = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedOrders) {
        try {
            return JSON.parse(storedOrders);
        } catch (e) {
            console.error("Failed to parse orders from localStorage", e);
            return mockOrders;
        }
    }
    return mockOrders;
};

const saveOrdersToStorage = (orders: Order[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
        window.dispatchEvent(new Event('cims-orders-storage'));
    }
};

if (typeof window !== 'undefined' && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
    saveOrdersToStorage(mockOrders);
}

let orders: Order[] = getOrdersFromStorage();
let nextId = orders.length > 0 ? Math.max(...orders.map(order => parseInt(order.id.split('-')[1]))) + 1 : 1;

export const ordersRepository = {
    getAll: (): Order[] => {
        orders = getOrdersFromStorage();
        return orders;
    },
    getById: (id: string): Order | undefined => {
        orders = getOrdersFromStorage();
        return orders.find(order => order.id === id);
    },
    create: (orderData: { customer: string; items: OrderItem[] }): Order => {
        orders = getOrdersFromStorage();
        const newOrder: Order = {
            id: `ORD-${String(nextId++).padStart(3, '0')}`,
            customer: orderData.customer,
            date: new Date().toISOString().split('T')[0],
            items: orderData.items,
            total: orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: 'Processing',
        };
        
        // Update stock for each item in the order
        orderData.items.forEach(orderItem => {
            itemsRepository.updateStock(orderItem.id, {
                quantity: orderItem.quantity,
                operation: 'remove',
            });
        });

        orders.unshift(newOrder);
        saveOrdersToStorage(orders);
        activityLogsRepository.add({ user: 'Admin', action: 'Order Created', details: `Created new order ${newOrder.id} for ${newOrder.customer}`, category: 'order' });
        
        return newOrder;
    },
    updateStatus: (id: string, status: Order['status']): Order | undefined => {
        orders = getOrdersFromStorage();
        const orderIndex = orders.findIndex(order => order.id === id);
        if (orderIndex === -1) return undefined;

        const originalStatus = orders[orderIndex].status;
        orders[orderIndex].status = status;
        saveOrdersToStorage(orders);

        activityLogsRepository.add({
            user: 'Admin',
            action: 'Order Status Updated',
            details: `Status for order ${id} changed from ${originalStatus} to ${status}`,
            category: 'order'
        });

        return orders[orderIndex];
    }
};
