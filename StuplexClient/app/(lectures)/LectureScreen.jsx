import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ZegoExpressEngine from 'zego-express-engine-reactnative';
import {APP_ID} from "@env"
import { zegoToken } from '../../http';


const LectureScreen = () => {
    const roomId='class_room_101';
    // useEffect(async ()=>{
    //     try{
    //         const {data}=await zegoToken();
    //         const profile = {
    //             appID : APP_ID,
    //             scenario : 1
    //         };
                    

    //         ZegoExpressEngine.createEngineWithProfile(profile);
    
    //         let roomConfig = new ZegoRoomConfig();
    
    //         roomConfig.isUserStatusNotify = true;
    //         roomConfig.token=data.token;
    
    //         ZegoExpressEngine.instance().loginRoom(roomId, {'userID': 'id1', 'userName': 'user1'}, roomConfig);
    //     }catch(e){
    //         console.log(e)
    //     }

    // },[])
    return (
        <View>
        <Text>LectureScreen</Text>
        </View>
    )
}

export default LectureScreen

const styles = StyleSheet.create({})