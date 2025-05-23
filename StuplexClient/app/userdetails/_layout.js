import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";

const userscreenlayout = () => {
  const {isAuth,user}=useSelector((state)=>state.auth);
  if(!isAuth) return <Redirect href='/(auth)'/>;
  if(isAuth && user?.isActivated) return <Redirect href={`(${user.role})`}/>
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default userscreenlayout;
