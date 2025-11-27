import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

// Componente que exibe uma tela de loading com overlay
const LoadingOverlay = ({ visible, text }) => {
  // Se 'visible' for false, não renderiza nada
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        {/* Spinner de carregamento */}
        <ActivityIndicator size="large" color="#4097faff" />
        {/* Texto opcional abaixo do spinner */}
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );
};

// =================== ESTILOS ===================
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',          // Fica por cima de tudo
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    justifyContent: 'center',      // Centraliza verticalmente
    alignItems: 'center',          // Centraliza horizontalmente
    zIndex: 9999,                  // Garante que fique acima de outros elementos
  },
  box: {
    backgroundColor: 'rgba(0,0,0,0.7)', // Caixa do loader
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,             // Bordas arredondadas
    alignItems: 'center',         // Centraliza conteúdo
  },
  text: {
    color: '#fff',                // Texto branco
    marginTop: 10,                // Espaço entre spinner e texto
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingOverlay;
