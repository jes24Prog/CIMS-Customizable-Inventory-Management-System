
'use client';
import type { Category } from '@/types';
import { activityLogsRepository } from './activity-logs-repository';

const LOCAL_STORAGE_KEY = 'cims_categories';

const initialCategories: Category[] = [
  { id: 1, name: 'Furniture', description: 'Chairs, desks, tables, etc.' },
  { id: 2, name: 'Electronics', description: 'Keyboards, monitors, accessories.' },
  { id: 3, name: 'Stationery', description: 'Pens, paper, notebooks.' },
  { id: 4, name: 'Accessories', description: 'Hubs, stands, organizers.' },
  { id: 5, name: 'Lighting', description: 'Lamps and bulbs.' },
];

const getCategoriesFromStorage = (): Category[] => {
    if (typeof window === 'undefined') {
        return initialCategories;
    }
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse categories from localStorage", e);
            return initialCategories;
        }
    }
    return initialCategories;
};

const saveCategoriesToStorage = (categories: Category[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
    }
};

if (typeof window !== 'undefined' && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
    saveCategoriesToStorage(initialCategories);
}

let categories: Category[] = getCategoriesFromStorage();
let nextId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;

export const categoriesRepository = {
    getAll: (): Category[] => {
        categories = getCategoriesFromStorage();
        return categories.sort((a, b) => a.name.localeCompare(b.name));
    },
    getById: (id: number): Category | undefined => {
        categories = getCategoriesFromStorage();
        return categories.find(c => c.id === id);
    },
    create: (data: Omit<Category, 'id'>): Category => {
        categories = getCategoriesFromStorage();
        const newCategory: Category = {
            id: nextId++,
            ...data,
        };
        categories.push(newCategory);
        saveCategoriesToStorage(categories);
        activityLogsRepository.add({ user: 'Admin', action: 'Category Added', details: `Added new category: ${newCategory.name}`, category: 'category' });
        return newCategory;
    },
    update: (id: number, data: Partial<Omit<Category, 'id'>>): Category | undefined => {
        categories = getCategoriesFromStorage();
        const index = categories.findIndex(c => c.id === id);
        if (index === -1) return undefined;
        
        const updatedCategory = { ...categories[index], ...data };
        categories[index] = updatedCategory;
        saveCategoriesToStorage(categories);
        activityLogsRepository.add({ user: 'Admin', action: 'Category Updated', details: `Updated category: ${updatedCategory.name}`, category: 'category' });
        return updatedCategory;
    },
    delete: (id: number): boolean => {
        categories = getCategoriesFromStorage();
        const categoryToDelete = categories.find(c => c.id === id);
        if (!categoryToDelete) return false;

        const initialLength = categories.length;
        categories = categories.filter(c => c.id !== id);
        
        if (categories.length < initialLength) {
            saveCategoriesToStorage(categories);
            activityLogsRepository.add({ user: 'Admin', action: 'Category Deleted', details: `Deleted category: ${categoryToDelete.name}`, category: 'category' });
            return true;
        }
        return false;
    }
};

    