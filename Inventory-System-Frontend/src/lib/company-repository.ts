
'use client';
import type { CompanyProfile } from '@/types';

const LOCAL_STORAGE_KEY = 'cims_company_profile';

const initialProfile: CompanyProfile = {
  name: 'CIMS Inc.',
  address: '123 Innovation Drive\nTech City, Metro Manila\n12345',
  phone: '+63 2 8123 4567',
};

const getProfileFromStorage = (): CompanyProfile => {
    if (typeof window === 'undefined') {
        return initialProfile;
    }
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse company profile from localStorage", e);
            return initialProfile;
        }
    }
    return initialProfile;
};

const saveProfileToStorage = (profile: CompanyProfile) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    }
};

if (typeof window !== 'undefined' && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
    saveProfileToStorage(initialProfile);
}

export const companyRepository = {
    get: (): CompanyProfile => {
        return getProfileFromStorage();
    },
    save: (profile: CompanyProfile): CompanyProfile => {
        saveProfileToStorage(profile);
        return profile;
    },
};

    