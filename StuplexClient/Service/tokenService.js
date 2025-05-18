import * as SecureStore from 'expo-secure-store';

export const storeAccessToken=async (accessToken)=>{
    await SecureStore.setItemAsync('accessToken',accessToken)
}

export const storeRefreshToken=async (refreshToken)=>{
    await SecureStore.setItemAsync('refreshToken',refreshToken)
}

export const getAccessToken=async()=>{
    const creds=await SecureStore.getItemAsync('accessToken');
    return creds;
}

export const getRefreshToken=async()=>{
    const creds=await SecureStore.getItemAsync('refreshToken');
    return creds;
}