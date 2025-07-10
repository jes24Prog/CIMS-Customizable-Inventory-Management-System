
'use client';
import { activityLogs } from '@/data/data';
import type { ActivityLog } from '@/types';

const LOCAL_STORAGE_KEY = 'cims_activity_logs';

const getLogsFromStorage = (): ActivityLog[] => {
    if (typeof window === 'undefined') {
        return activityLogs; // Return mock data during SSR
    }
    const storedLogs = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedLogs) {
        try {
            return JSON.parse(storedLogs);
        } catch (e) {
            console.error("Failed to parse activity logs from localStorage", e);
            return activityLogs; // Fallback to mock data
        }
    }
    return activityLogs; // Default mock data if nothing in storage
};

const saveLogsToStorage = (logs: ActivityLog[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    }
};

// Initialize storage if it's empty
if (typeof window !== 'undefined' && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
    saveLogsToStorage(activityLogs);
}

let logs: ActivityLog[] = getLogsFromStorage();

export const activityLogsRepository = {
    getAll: (): ActivityLog[] => {
        logs = getLogsFromStorage();
        return logs;
    },
    add: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
        const newLog: ActivityLog = {
            id: (logs.length + 1).toString() + Date.now(),
            timestamp: new Date().toISOString(),
            ...log,
        };
        logs.unshift(newLog); // Add to the beginning
        saveLogsToStorage(logs);
    }
};

    