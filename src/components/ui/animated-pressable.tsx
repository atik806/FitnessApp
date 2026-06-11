import { useCallback } from 'react';
import { Platform, Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
  haptics?: boolean;
  scale?: number;
}

export function HapticPressable({ style, haptics = true, scale = 0.96, onPress, onPressIn, onPressOut, ...props }: Props) {
  const scaleVal = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.value }],
  }));

  const handlePressIn = useCallback(
    (e: any) => {
      scaleVal.value = withSpring(scale, { damping: 15, stiffness: 200 });
      onPressIn?.(e);
    },
    [scale, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: any) => {
      scaleVal.value = withSpring(1, { damping: 15, stiffness: 200 });
      onPressOut?.(e);
    },
    [onPressOut],
  );

  const handlePress = useCallback(
    (e: any) => {
      if (Platform.OS !== 'web' && haptics) {
        try {
          const Haptics = require('expo-haptics');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}
      }
      onPress?.(e);
    },
    [onPress, haptics],
  );

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...props}
    />
  );
}
