import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Componente customizado de input animado com label flutuante, ícone e máscaras
const AnimatedInput = ({
  label,      // Texto do label
  iconName,   // Nome do ícone
  mask,       // Tipo de máscara (cpf, phone, plate)
  value,      // Valor atual do input
  onChangeText, // Função chamada quando o valor muda
  ...props    // Outros props passados para o TextInput
}) => {
  const [isFocused, setIsFocused] = useState(false); // Controla foco do input
  const [error, setError] = useState('');            // Mensagem de erro
  const labelAndIconPosition = useSharedValue(0);    // Valor compartilhado para animação da label

  const hasText = !!value; // Verifica se há texto no input

  // Efeito que anima a label quando o input está focado ou tem texto
  useEffect(() => {
    labelAndIconPosition.value = withTiming(isFocused || hasText ? -30 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isFocused, hasText]);

  // Estilo animado da label e ícone
  const labelAndIconAnimatedStyle = useAnimatedStyle(() => {
    const floating = isFocused || hasText;
    return {
      transform: [
        { translateY: labelAndIconPosition.value }, // Move label para cima quando flutua
        { scale: withTiming(floating ? 0.8 : 1, { duration: 250 }) } // Diminui o tamanho da label
      ],
      color: withTiming(floating ? '#0E2941' : '#888', { duration: 250 }), // Muda cor da label
    };
  });

  // Animação da borda do input
  const borderAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(isFocused ? '#0E2941' : '#ccc', { duration: 250 }),
  }));

  // =================== TRATAMENTO DE MUDANÇA DE TEXTO ===================
  const handleChangeText = (text) => {
    let formatted = text;
    let errorMsg = '';

    if (mask === 'cpf') {
      formatted = maskCPF(text); // Formata CPF
      if (formatted.length === 14 && !isValidCPF(formatted)) { // Valida CPF completo
        errorMsg = 'CPF inválido';
      }
    }

    if (mask === 'phone') {
      formatted = maskPhone(text); // Formata telefone
    }

    if (mask === 'plate') {
      formatted = maskPlate(text); // Formata placa
      if (formatted.length >= 7 && !isValidPlate(formatted)) { // Valida placa
        errorMsg = 'Placa inválida';
      }
    }

    setError(errorMsg);             // Atualiza mensagem de erro
    onChangeText && onChangeText(formatted); // Passa valor formatado para callback
  };

  // =================== MÁSCARAS ===================
  const maskCPF = (value) => {
    value = value.replace(/\D/g, '').slice(0, 11); // Remove tudo que não é número

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

  const isOldPlate = (plate) => /^[A-Z]{3}[0-9]{4}$/.test(plate.replace('-', ''));
  const isMercosulPlate = (plate) => /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(plate.replace('-', ''));
  const isValidPlate = (plate) => isOldPlate(plate) || isMercosulPlate(plate);

  // =================== RENDER ===================
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

// =================== ESTILOS ===================
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
