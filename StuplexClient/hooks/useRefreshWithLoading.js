import { useState,useEffect,useRef } from "react";
import axios from 'axios';
import { useDispatch} from "react-redux";
import { setAuth } from "../store/authSlice";
import {SERVER_URL} from '@env'
import { getRefreshToken,storeAccessToken,storeRefreshToken } from "../Service/tokenService";
import { useRouter } from "expo-router";
export function useRefreshWithLoading(){
    const [loading,setLoading]=useState(true);
    const dispatch=useDispatch();
    const router=useRouter();
    const hasNavigated = useRef(false);
    useEffect(()=>{
        (async()=>{
            try{
                const refreshTokenFromClient=await getRefreshToken();
                const {data}=await axios.post(
                    `${SERVER_URL}/auth/api/refresh`,
                    {refreshTokenFromClient},
                    {
                        withCredentials:true,
                    }
                );
                dispatch(setAuth(data));
                storeAccessToken(data.accessToken);
                storeRefreshToken(data.refreshToken);
            }catch(e){
                console.log(e);
            } finally{
                setLoading(false);
            }
        })()
    },[])

    return {loading};
}