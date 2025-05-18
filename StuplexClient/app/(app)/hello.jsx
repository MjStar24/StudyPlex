import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const hello = () => {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Hello from hello inside app</Text>
        </View>
  )
}

export default hello

const styles = StyleSheet.create({})