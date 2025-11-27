import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchInput from '../components/SearchInput'; // Componente de input de busca (não usado nesse trecho)

// Componente Header customizável
const Header = ({
  onMenuPress,              // Função para abrir o menu lateral
  title = 'Sistema de Acesso', // Texto do título padrão
  showSearch = true,        // Controle para mostrar ou não o input de busca
  showLogo = true,          // Controle para mostrar ou não o logo
}) => {
  return (
    <View style={[styles.header, { position: 'relative', zIndex: 100 }]}>
      {/* Botão do menu hamburguer */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton} activeOpacity={0.7}>
        <Feather name="menu" size={28} color="white" />
      </TouchableOpacity>

      {/* Título do Header */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Logo do lado direito */}
      {showLogo && (
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/kozzy_logo_2.png')}
            style={{ width: '50%', height: 80 }} // Ajusta o tamanho do logo
          />
        </View>
      )}
    </View>
  );
};

// =================== ESTILOS ===================
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2B3D52', // Cor de fundo do header
    height: 70,                  // Altura do header
    flexDirection: 'row',        // Layout horizontal
    alignItems: 'center',        // Centraliza verticalmente
    paddingHorizontal: 12,       // Espaço interno lateral
    justifyContent: 'space-between', // Espaça os elementos
    position: 'relative',
    paddingTop: 20               // Para dar espaçamento no topo (status bar)
  },

  menuButton: {
    padding: 6,
    marginRight: 12, // Espaço entre botão e título
  },

  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
    flex: 1, // Faz o título ocupar o espaço restante
  },

  searchBox: {
    backgroundColor: 'white',
    borderRadius: 4,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    width: 150,
    height: 32,
    marginRight: 12,
  },

  searchInput: {
    marginLeft: 6,
    fontSize: 16,
    color: '#2B3D52',
    flex: 1,
    height: 32,
  },

  logoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: 100,
  },

  kozzyText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 22,
    lineHeight: 18,
  },

  distribuidoraText: {
    color: '#D63434',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Header;
