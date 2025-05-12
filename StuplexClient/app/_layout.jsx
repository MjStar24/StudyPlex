import {Stack} from "expo-router"
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const _layout = () => {
  return (
    <View>
        <Stack screenOptions={{}}>
            <Stack.Screen name="index" options={{title:"home"}}/>
            <Stack.Screen name="about" options={{title:"about",headerShown:false}}/>
        </Stack>
        <Text>_layout</Text>
    </View>
  )
}

export default _layout

const styles = StyleSheet.create({})