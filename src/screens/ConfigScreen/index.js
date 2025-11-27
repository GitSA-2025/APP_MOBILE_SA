import { StyleSheet, Text, View } from 'react-native' // Importa componentes básicos do React Native
import React, { useState } from 'react' // Importa React e hook useState
import LoadingOverlay from '../../components/LoadingOverlay' // Importa componente customizado de overlay de carregamento

export default function ConfigScreen() {

    const [loading, setLoading] = useState(true); // Estado para controlar se o overlay de loading está visível

  return (
    <View>
      <Text>index</Text> {/* Exibe um texto simples na tela */}
      <LoadingOverlay visible={loading} text="Carregando..." /> {/* Exibe overlay de carregamento se loading for true */}
    </View>
  )
}
