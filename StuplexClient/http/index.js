import axios from 'axios'
import {SERVER_URL} from '@env'
import { getAccessToken } from '../Service/tokenService';

const api=axios.create({
    baseURL:SERVER_URL,
    withCredentials: true,
    headers:{
        'Content-type': 'application/json',
        Accept: 'application/json',
    }
});

api.interceptors.request.use(async(config)=>{
    const token=await getAccessToken();
    console.log(token);
    if(token) config.headers['Authorization']=`Bearer ${token}`;
    return config
},(error) => Promise.reject(error)
)

export const sendOtp=(data)=>api.post('/auth/api/send-otp',data);
export const verifyOtp = (data) => api.post('auth/api/verify-otp', data);
export const zegoToken=(data)=>api.get('/stream/api/token',data);

export default api;