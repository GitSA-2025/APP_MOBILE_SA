import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Componente customizado de select animado com label flutuante, ícone e dropdown
const AnimatedSelect = ({ label, iconName, options = [], value, onSelect }) => {
  const [isFocused, setIsFocused] = useState(false); // Controle do foco/label flutuante
  const [isOpen, setIsOpen] = useState(false);       // Controle de abertura do dropdown
  const labelAndIconPosition = useSharedValue(0);    // Valor compartilhado para animação da label

  const hasValue = !!value; // Verifica se há valor selecionado

  // Efeito para animar label quando o input está focado ou possui valor
  useEffect(() => {
    if (isFocused || hasValue) {
      labelAndIconPosition.value = withTiming(-30, { duration: 250, easing: Easing.inOut(Easing.ease) });
    } else {
      labelAndIconPosition.value = withTiming(0, { duration: 250, easing: Easing.inOut(Easing.ease) });
    }
  }, [isFocused, hasValue, labelAndIconPosition]);

  // Estilo animado da label e ícone
  const labelAndIconAnimatedStyle = useAnimatedStyle(() => {
    const isFloating = isFocused || hasValue;
    return {
      transform: [
        { translateY: labelAndIconPosition.value }, // Move a label para cima
        { scale: withTiming(isFloating ? 0.8 : 1, { duration: 250 }) } // Reduz tamanho quando flutua
      ],
      color: withTiming(isFloating ? '#0E2941' : '#888', { duration: 250 }), // Muda cor da label
    };
  });

  // Estilo animado da borda
  const borderAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(isFocused ? '#0E2941' : '#ccc', { duration: 250 }),
  }));

  // Estilo animado do dropdown (altura e opacidade)
  const dropdownAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: withTiming(isOpen ? 180 : 0, { duration: 250 }), // Altura do dropdown
    opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),     // Transparência
  }));

  // Alterna abertura/fechamento do dropdown e foco
  const handleToggle = () => {
    setIsFocused(!isOpen); // Label flutuante enquanto aberto
    setIsOpen(!isOpen);
  };

  // Seleciona um item e fecha o dropdown
  const handleSelect = (item) => {
    onSelect(item);      // Passa valor selecionado
    setIsFocused(false); // Remove foco da label
    setIsOpen(false);    // Fecha dropdown
  };

  return (
    <View style={{ width: '100%' }}>
      {/* Container principal */}
      <Animated.View style={[styles.container, borderAnimatedStyle]}>
        {/* Label e ícone animados */}
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

        {/* Input simulado (abre dropdown ao clicar) */}
        <TouchableOpacity style={styles.input} onPress={handleToggle} activeOpacity={0.7}>
          <Text style={[styles.valueText, !value && styles.placeholderText]}>
            {value || 'Selecionar...'} {/* Mostra valor ou placeholder */}
          </Text>
          <MaterialCommunityIcons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#27445B"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Dropdown animado */}
      <Animated.View style={[styles.dropdownContainer, dropdownAnimatedStyle]}>
        <FlatList
          data={options} // Lista de opções
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={options.length > 4} // Habilita scroll se tiver muitas opções
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
