import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AnimatedSelect = ({ label, iconName, options = [], value, onSelect }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const labelAndIconPosition = useSharedValue(0);

  const hasValue = !!value;

  useEffect(() => {
    if (isFocused || hasValue) {
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
  }, [isFocused, hasValue, labelAndIconPosition]);

  const labelAndIconAnimatedStyle = useAnimatedStyle(() => {
    const isFloating = isFocused || hasValue;

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

  const dropdownAnimatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(isOpen ? 180 : 0, { duration: 250 }),
      opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
    };
  });

  const handleToggle = () => {
    setIsFocused(!isOpen);
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    onSelect(item);
    setIsFocused(false);
    setIsOpen(false);
  };

  return (
    <View style={{ width: '100%' }}>
      <Animated.View style={[styles.container, borderAnimatedStyle]}>
        <Animated.View
          style={[
            styles.contentWrapper,
            labelAndIconAnimatedStyle,
            (isFocused || hasValue) && styles.contentWrapperFocused
          ]}
        >
          <MaterialCommunityIcons name={iconName} size={24} style={styles.icon} />
          <Animated.Text style={styles.label}>{label}</Animated.Text>
        </Animated.View>

        <TouchableOpacity style={styles.input} onPress={handleToggle} activeOpacity={0.7}>
          <Text style={[styles.valueText, !value && styles.placeholderText]}>
            {value || 'Selecionar...'}
          </Text>
          <MaterialCommunityIcons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#27445B"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Dropdown */}
      <Animated.View style={[styles.dropdownContainer, dropdownAnimatedStyle]}>
        <FlatList
          data={options}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={options.length > 4}
          renderItem={({ item }) => (
            <Pressable style={styles.option} onPress={() => handleSelect(item)}>
              <Text style={styles.optionText}>{item}</Text>
            </Pressable>
          )}
        />
      </Animated.View>
    </View>
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
    backgroundColor: '#fff',
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
    fontFamily: 'Roboto_500Medium',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  valueText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Roboto_400Regular',
  },
  placeholderText: {
    color: '#888',
  },
  dropdownContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fff',
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
});

export default AnimatedSelect;
