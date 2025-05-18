import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { verifyOtp } from '../../http';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../store/authSlice';
import { useRouter } from 'expo-router';
import {  storeAccessToken, storeRefreshToken,getAccessToken } from '../../Service/tokenService';

const Otp = () => {
    const [otp,setOtp]=useState('');
    const {phone,hash}=useSelector((state)=>state.auth.otp);
    const router=useRouter();
    const dispatch=useDispatch();
    const verify=async ()=>{
        try{
            const {data}=await verifyOtp({phone,hash,otp});
            dispatch(setAuth({user:data.user}));
            await storeAccessToken(data.accessToken);
            await storeRefreshToken(data.refreshToken);
            const token=await getAccessToken();
            console.log("tokens",token);
            console.log("otp data",data);
            router.push('/Home')
        }catch(e){
            console.log(e);
        }

    }
    return (
        <View>
        <TextInput value={otp} onChangeText={setOtp}/>
        <Button title='Submit' onPress={()=>verify(otp)}/>
        </View>
    )
}

export default Otp

const styles = StyleSheet.create({})