import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AnimatedInput = ({
  label,
  iconName,
  mask,
  value,
  onChangeText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const labelAndIconPosition = useSharedValue(0);

  const hasText = !!value;

  useEffect(() => {
    labelAndIconPosition.value = withTiming(isFocused || hasText ? -30 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isFocused, hasText]);

  const labelAndIconAnimatedStyle = useAnimatedStyle(() => {
    const floating = isFocused || hasText;
    return {
      transform: [
        { translateY: labelAndIconPosition.value },
        { scale: withTiming(floating ? 0.8 : 1, { duration: 250 }) }
      ],
      color: withTiming(floating ? '#0E2941' : '#888', { duration: 250 }),
    };
  });

  const borderAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(isFocused ? '#0E2941' : '#ccc', { duration: 250 }),
  }));

  // =================== CHANGE ===================
  const handleChangeText = (text) => {
    let formatted = text;
    let errorMsg = '';

    if (mask === 'cpf') {
      formatted = maskCPF(text);
      if (formatted.length === 14 && !isValidCPF(formatted)) {
        errorMsg = 'CPF inválido';
      }
    }

    if (mask === 'phone') {
      formatted = maskPhone(text);
    }

    if (mask === 'plate') {
      formatted = maskPlate(text);

      if (formatted.length >= 7 && !isValidPlate(formatted)) {
        errorMsg = 'Placa inválida';
      }
    }

    setError(errorMsg);
    onChangeText && onChangeText(formatted);
  };

  const maskCPF = (value) => {
    value = value.replace(/\D/g, '').slice(0, 11);

    if (value.length <= 3) return value;
    if (value.length <= 6) return value.replace(/(\d{3})(\d+)/, '$1.$2');
    if (value.length <= 9) return value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');

    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const maskPhone = (value) => {
    value = value.replace(/\D/g, '').slice(0, 11);

    if (value.length <= 2) return `(${value}`;
    if (value.length <= 6) return value.replace(/(\d{2})(\d+)/, '($1) $2');
    if (value.length <= 10) return value.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');

    return value.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  };

  const maskPlate = (value) => {
    value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);

    if (value.length <= 3) return value;
    return value.replace(/^([A-Z]{3})([0-9A-Z].*)$/, '$1-$2');
  };

  // =================== VALIDAÇÕES ===================

  const isValidCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    resto = resto === 10 ? 0 : resto;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    resto = resto === 10 ? 0 : resto;
    return resto === parseInt(cpf.charAt(10));
  };

  // ✅ Padrão antigo: AAA-1234
  const isOldPlate = (plate) => {
    const clean = plate.replace('-', '');
    return /^[A-Z]{3}[0-9]{4}$/.test(clean);
  };

  // ✅ Padrão Mercosul: ABC-1D23
  const isMercosulPlate = (plate) => {
    const clean = plate.replace('-', '');
    return /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean);
  };

  const isValidPlate = (plate) => {
    return isOldPlate(plate) || isMercosulPlate(plate);
  };

  return (
    <>
      <Animated.View style={[styles.container, borderAnimatedStyle]}>
        <Animated.View style={[
          styles.contentWrapper,
          labelAndIconAnimatedStyle,
          hasText ? styles.contentWrapperFocused : null
        ]}>
          <MaterialCommunityIcons name={iconName} size={24} style={styles.icon} />
          <Animated.Text style={styles.label}>{label}</Animated.Text>
        </Animated.View>

        <TextInput
          style={styles.input}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={handleChangeText}
          keyboardType={mask === 'cpf' || mask === 'phone' ? 'numeric' : 'default'}
          autoCapitalize={mask === 'plate' ? 'characters' : 'none'}
          {...props}
        />
      </Animated.View>

      {error ? <Animated.Text style={styles.errorText}>{error}</Animated.Text> : null}
    </>
  );
};

// =================== STYLES ===================
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
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginLeft: 10,
    marginTop: -5,
    fontFamily: 'Roboto_400Regular'
  }
});

export default AnimatedInput;
