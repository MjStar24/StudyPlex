import {Stack} from "expo-router"
import { StyleSheet, Text, View } from 'react-native'
import { store } from "../store"
import {Provider} from 'react-redux'

import React from 'react'

const _layout = () => {
  return (
    <View>
        <Provider store={store}>
            <Stack screenOptions={{}}>
                <Stack.Screen name="(auth)" options={{headerShown:false}}/>
                <Stack.Screen name="(app)" options={{headerShown:false}}/>
            </Stack>
        </Provider>
        
    </View>
  )
}

export default _layout

const styles = StyleSheet.create({})