import { StyleSheet} from 'react-native'
import {Stack} from 'expo-router' 
import React from 'react'

const LoginLayout = () => {
  return (
    <Stack screenOptions={{
       headerShown:false
    }}/>
  )
}

export default LoginLayout

const styles = StyleSheet.create({})