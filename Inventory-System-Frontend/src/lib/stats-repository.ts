
'use client';
import { itemsRepository } from './items-repository';
import { ordersRepository } from './orders-repository';

export const statsRepository = {
    getDashboardStats: () => {
        const items = itemsRepository.getAll();
        const orders = ordersRepository.getAll();

        const totalStockItems = items.reduce((sum, item) => sum + item.stock, 0);
        const lowStockItems = items.filter(i => i.status === 'Low Stock').length;
        const ordersPending = orders.filter(o => o.status === 'Processing').length;
        const totalRevenue = orders
            .filter(o => o.status === 'Delivered')
            .reduce((sum, order) => sum + order.total, 0);

        return {
            totalStockItems,
            lowStockItems,
            ordersPending,
            totalRevenue,
        };
    },
};
