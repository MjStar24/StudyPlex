// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../context/AuthContext';  // path adjust karo

// const Index = () => {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkStatus = async () => {
//       const isFirstTime = await AsyncStorage.getItem('isFirstTime');

//       if (!isFirstTime) {
//         router.replace('/onboarding');
//       } else if (!user.phone) {
//         router.replace('/login');
//       } else if (!user.otpVerified) {
//         router.replace('/verify');
//       } else if (!user.name || !user.goal) {
//         router.replace('/userdetails');
//       } else {
//         router.replace('/home');
//       }
//       setLoading(false);
//     };

//     checkStatus();
//   }, [user, router]);

//   if (loading) {
//     return (
//       <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return null;
// };

// export default Index;

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})


