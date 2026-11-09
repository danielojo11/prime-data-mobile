/* eslint-disable react-hooks/refs */
import { useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Returns a stable `Animated.Value` for the lifetime of the component.
 *
 * React Native Web does not export `useAnimatedValue`, so this small shared
 * helper keeps animations working on native and web. Keeping the value in a
 * ref is the documented React Native pattern for persistent animated values.
 */
export default function useAnimatedValue(initialValue) {
  const ref = useRef(null);

  if (ref.current === null) {
    ref.current = new Animated.Value(initialValue);
  }

  return ref.current;
}
