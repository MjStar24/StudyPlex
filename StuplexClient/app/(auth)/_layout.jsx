import { StyleSheet } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";

const LoginLayout = () => {
  const { isAuth, user } = useSelector((state) => state.auth);
  if (isAuth && !user?.isActivated) return <Redirect href="/userdetails" />;
  else if (user?.role) return <Redirect href={`/${user.role}`} />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="verify"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
  );
};

export default LoginLayout;

const styles = StyleSheet.create({});
