
'use client';
import { itemsRepository } from './items-repository';
import { ordersRepository } from './orders-repository';
import { categoriesRepository } from './categories-repository';
import type { Order } from '@/types';

const getMonthName = (month: number) => {
  return new Date(2000, month).toLocaleString('default', { month: 'short' });
}

export const reportsRepository = {
    getOverview: () => {
        const orders = ordersRepository.getAll();
        const items = itemsRepository.getAll();
        const deliveredOrders = orders.filter(o => o.status === 'Delivered');

        // Overview stats
        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const activeCustomers = new Set(orders.map(o => o.customer)).size;

        // Sales data by month
        const monthlySales: {[key: string]: number} = {};
        deliveredOrders.forEach(order => {
            const month = new Date(order.date).getMonth();
            const monthName = getMonthName(month);
            monthlySales[monthName] = (monthlySales[monthName] || 0) + order.total;
        });

        const salesData = Object.entries(monthlySales).map(([month, total]) => ({ month, total, cost: total * 0.6 }));

        // Revenue by category
        const categoryRevenue: {[key: string]: number} = {};
        if (deliveredOrders.length > 0 && items.length > 0) {
            deliveredOrders.forEach(order => {
                (order.items || []).forEach(orderItem => {
                    const itemDetails = items.find(i => i.id === orderItem.id);
                    if (itemDetails) {
                        const category = itemDetails.category;
                        categoryRevenue[category] = (categoryRevenue[category] || 0) + (orderItem.price * orderItem.quantity);
                    }
                });
            });
        }
        const categoryData = Object.entries(categoryRevenue).map(([name, value]) => ({ name, value }));

        // Top selling items
        const itemSales: {[key: number]: { name: string, category: string, sold: number, revenue: number }} = {};
        if (deliveredOrders.length > 0 && items.length > 0) {
            deliveredOrders.forEach(order => {
                (order.items || []).forEach(orderItem => {
                    if (!itemSales[orderItem.id]) {
                        const itemDetails = items.find(i => i.id === orderItem.id);
                        itemSales[orderItem.id] = { name: orderItem.name, category: itemDetails?.category || 'N/A', sold: 0, revenue: 0 };
                    }
                    itemSales[orderItem.id].sold += orderItem.quantity;
                    itemSales[orderItem.id].revenue += orderItem.price * orderItem.quantity;
                });
            });
        }
        const topSellingItems = Object.values(itemSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
        
        // Top customers
        const customerSpending: {[key: string]: { name: string, orders: number, spent: number }} = {};
        deliveredOrders.forEach(order => {
            if(!customerSpending[order.customer]) {
                customerSpending[order.customer] = { name: order.customer, orders: 0, spent: 0 };
            }
            customerSpending[order.customer].orders += 1;
            customerSpending[order.customer].spent += order.total;
        });
        const topCustomers = Object.values(customerSpending).sort((a, b) => b.spent - a.spent).slice(0, 5);


        return {
            overviewStats: { totalRevenue, totalOrders, activeCustomers },
            salesData,
            categoryData,
            topSellingItems,
            topCustomers,
        }
    },
    getStock: () => {
        const items = itemsRepository.getAll();
        const inventoryData = items.map(item => ({
            id: item.id,
            name: item.name,
            sku: item.sku || 'N/A',
            category: item.category,
            stock: item.stock,
            cost: item.price * 0.6, // Assuming cost is 60% of price for demo
            value: item.stock * (item.price * 0.6)
        }));
        return { inventoryData };
    },
    getSales: () => {
        const orders = ordersRepository.getAll();
        const salesTransactionData = orders.flatMap((order: Order) => 
            Array.isArray(order.items) ? order.items.map(item => ({
                id: `${order.id}-${item.id}`,
                date: order.date,
                customer: order.customer,
                item: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price
            })) : []
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return { salesTransactionData };
    },
    getFinancial: () => {
        const orders = ordersRepository.getAll();
        const deliveredOrders = orders.filter(o => o.status === 'Delivered');
         // Sales data by month
        const monthlySales: {[key: string]: { total: number, cost: number }} = {};
        deliveredOrders.forEach(order => {
            const month = new Date(order.date).getMonth();
            const monthName = getMonthName(month);
            if (!monthlySales[monthName]) {
                monthlySales[monthName] = { total: 0, cost: 0 };
            }
            monthlySales[monthName].total += order.total;
            monthlySales[monthName].cost += order.total * 0.6; // Assuming cost is 60% of revenue
        });

        const salesData = Object.entries(monthlySales).map(([month, data]) => ({ month, ...data }));
        
        const totalRevenue = salesData.reduce((sum, item) => sum + item.total, 0);
        const totalCosts = salesData.reduce((sum, item) => sum + item.cost, 0);
        const netProfit = totalRevenue - totalCosts;

        return { 
            salesData,
            financialSummary: {
                totalRevenue,
                totalCosts,
                netProfit
            }
        };
    },
    getStockUtilization: () => {
        const allCategories = categoriesRepository.getAll();
        const items = itemsRepository.getAll();

        const categoryData = allCategories.map(category => {
            const categoryItems = items.filter(item => item.category === category.name);
            const totalStock = categoryItems.reduce((sum, item) => sum + item.stock, 0);
            const capacity = Math.max(100, totalStock + 20); // Dummy capacity
            const utilization = capacity > 0 ? Math.round((totalStock / capacity) * 100) : 0;
            const value = categoryItems.reduce((sum, item) => sum + (item.stock * item.price), 0);
            
            let status = 'Normal';
            if (utilization >= 90) status = 'Critical';
            else if (utilization >= 70) status = 'High';
            else if (utilization < 40) status = 'Low';

            return {
                name: category.name,
                items: categoryItems.length,
                capacity,
                utilization,
                status,
                value
            }
        });

        return { categoryData };
    },
};
