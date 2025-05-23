import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { store } from "../store";
import { Provider } from "react-redux";
import { useRefreshWithLoading } from "../hooks/useRefreshWithLoading.js";



const LayoutContent = () => {
  const { loading } = useRefreshWithLoading();
  if (loading) {
    return <Text>Loading</Text>;
  }

  return (
    
      <Stack>
        {/* <Stack.Screen name="index" options={{headerShown:false}}/> */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="userdetails" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="(studyplexinfo)" options={{ headerShown: false }} />
      </Stack>
    
  );
};


const RootLayout = () => {
  return (
    <Provider store={store}>
      <LayoutContent />
    </Provider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
