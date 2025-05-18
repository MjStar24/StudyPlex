import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const LectureHome = () => {
    const router=useRouter()
    const startStream=()=>router.push('/LectureScreen')
  return (
    <View>
      <Button Start onPress={()=>startStream()}/>
    </View>
  )
}

export default LectureHome

const styles = StyleSheet.create({})