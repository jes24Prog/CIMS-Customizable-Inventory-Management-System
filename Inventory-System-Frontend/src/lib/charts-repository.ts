
'use client';
import { weeklyData, monthlyData, stockData } from '@/data/data';

export const chartsRepository = {
    getSales: (timeRange: 'weekly' | 'monthly') => {
        // This can remain static as it's for demonstration
        return timeRange === 'weekly' ? weeklyData : monthlyData;
    },
    getStock: () => {
        // This can also remain static
        return stockData;
    },
};
