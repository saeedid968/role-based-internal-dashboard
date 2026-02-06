// src/services/api.js
import { USERS_DATA } from './MockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getUsers = async () => {
    await delay(1000); // 1 second loading simulation
    return [...USERS_DATA];
};
