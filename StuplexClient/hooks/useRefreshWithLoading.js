import { useState,useEffect } from "react";
import axios from 'axios';
import { useDispatch} from "react-redux";
import { setAuth } from "../store/authSlice";
import {SERVER_URL} from '@env'
export function useRefreshWithLoading(){
    const [loading,setLoading]=useState(true);
    const dispatch=useDispatch();
    useEffect(()=>{
        (async()=>{
            try{
                const data=await axios.get(
                    `${SERVER_URL}/auth/refresh`,
                    {
                        withCredentials:true,
                    }
                );
                dispatch(setAuth(data));
                setLoading(false);
            }catch(e){
                console.log(e);
                setLoading(false);
            }
        })
    },[])

    return {loading};
}