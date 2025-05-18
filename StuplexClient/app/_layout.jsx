import React from 'react'
import {Stack} from "expo-router"
import { StyleSheet, Text, View } from 'react-native'
import { store } from "../store"
import {Provider} from 'react-redux'
import { useRefreshWithLoading } from "../hooks/useRefreshWithLoading"

const LayoutContent=()=>{
    // const {loading}=useRefreshWithLoading();
    // if(loading){
    //     return (
    //         <Text>Loading</Text>
    //     )
    // }

    return (
        <Stack screenOptions={{}}>
                <Stack.Screen name="(auth)" options={{headerShown:false}}/>
                <Stack.Screen name="(app)" options={{headerShown:false}}/>
        </Stack>
    );
}

const RootLayout = () => {
  return (
   
        <Provider store={store}>
            <LayoutContent/>
        </Provider>
        
    
  )
}

export default RootLayout

const styles = StyleSheet.create({})