import React from 'react';
import { View, useColorScheme } from 'react-native';
import { Colors } from '../constants/color.js';

const ThemedView = ({ style, ...props }) => {
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const theme = Colors[colorScheme] || Colors.light;

  return (
    <View
      {...props}
      style={[{ backgroundColor: theme.background, flex: 1 }, style]}
    />
  );
};

export default ThemedView;
