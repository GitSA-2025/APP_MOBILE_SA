import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchInput from '../components/SearchInput';


const Header = ({
  onMenuPress,
  title = 'Sistema de Acesso',
  showSearch = true,
  showLogo = true,
}) => {
  return (
    <View style={[styles.header, { position: 'relative', zIndex: 100 }]}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton} activeOpacity={0.7}>
        <Feather name="menu" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>

      {showSearch && <SearchInput />}

      {showLogo && (
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/kozzy_logo_2.png')}
            style={{ width: '50%', height: 80 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
    backgroundColor: '#2B3D52',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    position: 'relative',
    paddingTop: 20
  },

  menuButton: {
    padding: 6,
    marginRight: 12,
  },

  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
    flex: 1,
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