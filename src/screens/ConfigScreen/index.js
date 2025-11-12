import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import LoadingOverlay from '../../components/LoadingOverlay'

export default function ConfigScreen() {

    const [loading, setLoading] = useState(true);
  return (
    <View>
      <Text>index</Text>
      <LoadingOverlay visible={loading} text="Carregando..." />
    </View>
  )
}

