import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROFILES } from '../services/MockData';
import { useAuth } from './Auth_Context';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (user?.role) {
            const sessionProfile = sessionStorage.getItem(`profile_${user.role}`);

            if (sessionProfile) {
                setProfileData(JSON.parse(sessionProfile));
            } else {
                setProfileData(MOCK_PROFILES[user.role]);
            }
        }
    }, [user?.role]);

    const updateProfile = (updatedFields) => {
        const updated = { ...profileData, ...updatedFields };
        setProfileData(updated);
        sessionStorage.setItem(`profile_${user.role}`, JSON.stringify(updated));
    };

    const resetProfile = () => {
        if (user?.role) {
            setProfileData(MOCK_PROFILES[user.role]);
            sessionStorage.removeItem(`profile_${user.role}`);
        }
    };

    return (
        <ProfileContext.Provider value={{ profileData, updateProfile, resetProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);