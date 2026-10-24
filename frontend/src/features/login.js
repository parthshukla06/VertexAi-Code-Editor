import { api } from '../utils/axios';

export const login = async (token) => {
    try {
        const {data} = await api.post('/api/auth/login', { token });
        return data;
    }catch (error) {
        console.error('Error during login:', error);
        throw error;
    }   
}