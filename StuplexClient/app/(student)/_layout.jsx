import { Stack, Redirect } from "expo-router";
import { useSelector } from "react-redux";

const _layout = () => {
  const { isAuth, user } = useSelector((state) => state.auth);
  if (!isAuth) return <Redirect href="/(auth)" />;
  if (isAuth && !user?.isActivated) return <Redirect href="/userdetails" />;
  else if (user?.role === "educator") return <Redirect href="/(educator)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default _layout;
