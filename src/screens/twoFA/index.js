import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './styles';
import AnimatedInput from '../../components/AnimatedInput';
import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../api/api';

export default function TwoFA() {

  const [codigo, setCodigo] = useState('');
  const route = useRoute();
  const navigation = useNavigation();

  const { email } = route.params;

  async function twofa(codigo) {
        const dados = { email, codigo };

        try {
            const res = await api.post('api/mobile/app/verificar-2fa', dados);
            return res.data;
        } catch (err) {
            console.error('Erro ao fazer a 2FA:', err.response?.data || err.message);
            if(err.response?.data == '{"error":"Código inválido."}'){
              return Alert.alert('Atenção', 'Código inválido.');
            }
            throw err;
        }
    }

    const handleAvancar = async () => {
            if (!codigo) {
                Alert.alert('Atenção', 'Preencha o campo!');
                return;
            }
    
            try {
                await twofa(codigo);
                Alert.alert('Sucesso', 'Faça seu login novamente para entrar no sistema.');
                navigation.navigate('Login');
            } catch (err) {
                Alert.alert('Erro', 'Código inválido ou expirado.');
            }
        };

  return (
    <KeyboardAvoidingView
    style={{ flex:1 }}
    behavior={Platform.OS === 'ios' ? 'padding'  : 'height'}>
      <ScrollView
      contentContainerStyle={{ flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
      <View style={styles.leftPainel}>
        <Text style={styles.title}>Continue o seu cadastro!</Text>
        <Text style={styles.subTitle}>
          Insira o código enviado ao seu email para confirmar a verificação.
        </Text>
      </View>
        <View style={styles.rightPainel}>
          <Text style={styles.titleLogin}>Digite o código de verificação</Text>

          <AnimatedInput
                        label="Código"
                        iconName="numeric"
                        value={codigo}
                        onChangeText={setCodigo}
                        maxLength={6}
                        keyboardType="number-pad"
                    />

          <TouchableOpacity style={styles.btnAvancar} onPress={handleAvancar}>
            <Text style={styles.btnText}>Avançar</Text>
          </TouchableOpacity>

        </View>
    </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}