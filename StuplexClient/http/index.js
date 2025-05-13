import axios from 'axios'
import {SERVER_URL} from '@env'

const api=axios.create({
    baseURL:SERVER_URL,
    withCredentials: true,
    headers:{
        'Content-type': 'application/json',
        Accept: 'application/json',
    }
});

export const sendOtp=(data)=>api.post('/auth/api/send-otp',data);
export const verifyOtp = (data) => api.post('auth/api/verify-otp', data);

export default api;