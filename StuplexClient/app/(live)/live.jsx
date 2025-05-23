// import { StyleSheet, Text, View } from 'react-native'
// import React, { useEffect } from 'react'
// import {APP_ID} from '@env'
// import { zegoToken } from '../../http';

// import ZegoExpressEngine,{ZegoRoomConfig} from 'zego-express-engine-reactnative';

// const live = () => {
//     useEffect(async ()=>{
//         const Token=await zegoToken();
//         const profile = {
//             appID : APP_ID,
//             scenario : 1
//         };
//         ZegoExpressEngine.createEngineWithProfile(profile)
//         let roomConfig = new ZegoRoomConfig();
//         roomConfig.isUserStatusNotify = true;
//         roomConfig.token=Token;
//         ZegoExpressEngine.instance().loginRoom('room1', {'userID': 'id1', 'userName': 'user1'}, roomConfig);
//     },[])
//     return (
//         <View>
//         <Text>live</Text>
//         </View>
//     )
// }

// export default live

// const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Live = () => {
  return (
    <View>
      <Text>L</Text>
    </View>
  )
}

export default Live

const styles = StyleSheet.create({})