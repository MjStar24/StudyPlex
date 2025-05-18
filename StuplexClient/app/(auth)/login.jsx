import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { sendOtp } from '../../http';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../store/authSlice';
import { useRouter } from 'expo-router';
import {SERVER_URL} from '@env'

const Login = () => {
  const [phone,setPhone]=useState('');
  const dispatch=useDispatch();
  const router=useRouter();
  const getOtp=async (phone)=>{
      try{
        console.log(SERVER_URL);
        console.log("hii");
        const {data}=await sendOtp({phone});
        console.log("otp",data.otp)
        dispatch(setOtp({phone:data.phone,hash:data.hash}))
        router.push('/otp');
      }catch(e){
        console.log(e);
      }
  }
  return (
    <View>
      <TextInput value={phone} onChangeText={setPhone}/>
      <Button title='Next' onPress={()=>getOtp(phone)}/>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({})