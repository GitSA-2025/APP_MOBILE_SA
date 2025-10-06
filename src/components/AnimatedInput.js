import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AnimatedInput = ({ label, iconName, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAndIconPosition = useSharedValue(0);

  const hasText = !!props.value;

  useEffect(() => {
    if (isFocused || hasText) {
      labelAndIconPosition.value = withTiming(-30, {
        duration: 250,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      labelAndIconPosition.value = withTiming(0, {
        duration: 250,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isFocused, hasText, labelAndIconPosition]);

  const labelAndIconAnimatedStyle = useAnimatedStyle(() => {
    const isFloating = isFocused || hasText;

    return {
      transform: [
        { translateY: labelAndIconPosition.value },
        { scale: withTiming(isFloating ? 0.8 : 1, { duration: 250 }) }
      ],
      
      color: withTiming(isFloating ? '#0E2941' : '#888', { duration: 250 }),
    };
  });


  const borderAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(isFocused ? '#0E2941' : '#ccc', { duration: 250 }),
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  

  return (
    <Animated.View style={[styles.container, borderAnimatedStyle]}>
      <Animated.View style={[styles.contentWrapper, labelAndIconAnimatedStyle, isFocused || hasText ? styles.contentWrapperFocused : null]}>
        <MaterialCommunityIcons name={iconName} size={24} style={styles.icon} />
        <Animated.Text style={styles.label}>{label}</Animated.Text>
      </Animated.View>
      <TextInput
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  contentWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    top: 18, 
  },
  contentWrapperFocused: {
    left: 5,
  },
  icon: {
    marginRight: 5,
    color: '#27445B',
  },
  label: {
    fontSize: 16,
    color: '#27445B',
    fontFamily: 'Roboto_500Medium'
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingLeft: 5,
    fontFamily: 'Roboto_400Regular'
  },
});

export default AnimatedInput;