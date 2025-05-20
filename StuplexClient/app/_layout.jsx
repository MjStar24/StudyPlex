import { StyleSheet, Text, View } from 'react-native'
import {Stack} from 'expo-router' 
import React from 'react'
import { AuthProvider } from '../context/AuthContext.js';
import { store } from "../store"
import {Provider} from 'react-redux'
const RootLayout = () => {
  return (
    <Provider store={store}>
    <AuthProvider>
    <Stack >
      <Stack.Screen name="index" options={{headerShown:false}}/>
      <Stack.Screen name="(auth)" options={{headerShown:false}}/>
      <Stack.Screen name="(userdetails)" options={{headerShown:false}}/>
      <Stack.Screen name="(dashboard)" options={{headerShown:false}}/>
      <Stack.Screen name="(studyplexinfo)" options={{headerShown:false}}/>

  </Stack>
  </AuthProvider>
  </Provider>
  )
} 

export default RootLayout

const styles = StyleSheet.create({})