import { StyleSheet, } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{}}>
                    <Stack.Screen name="login" />
                    <Stack.Screen name="otp"/>
    </Stack>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})