import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './styles';
import AnimatedInput from '../../components/AnimatedInput'; // Input customizado com animação
import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'; // Para pegar params e navegação
import api from '../../api/api'; // Instância da API
import LoadingOverlay from '../../components/LoadingOverlay'; // Tela de loading

export default function TwoFA() {

  // --------------------------
  // Estados do componente
  // --------------------------
  const [codigo, setCodigo] = useState(''); // Código 2FA digitado
  const [loading, setLoading] = useState(false); // Loading para requisições

  // --------------------------
  // Navegação e rota
  // --------------------------
  const route = useRoute(); // Pega informações da rota atual
  const navigation = useNavigation(); // Para navegar entre telas
  const { email } = route.params; // Email recebido da tela anterior

  // --------------------------
  // Função para enviar código para a API
  // --------------------------
  async function twofa(codigo) {
    const dados = { email, codigo }; // Monta payload da requisição

    try {
      // Chama endpoint de verificação de 2FA
      const res = await api.post('api/mobile/app/verificar-2fa', dados);
      return res.data;
    } catch (err) {
      console.error('Erro ao fazer a 2FA:', err.response?.data || err.message);

      // Caso a API retorne código inválido, exibe alerta específico
      if (err.response?.data == '{"error":"Código inválido."}') {
        return Alert.alert('Atenção', 'Código inválido.');
      }

      throw err; // Lança outros erros para tratamento genérico
    }
  }

  // --------------------------
  // Função chamada ao pressionar "Avançar"
  // --------------------------
  const handleAvancar = async () => {
    // Valida se o campo está preenchido
    if (!codigo) {
      Alert.alert('Atenção', 'Preencha o campo!');
      return;
    }

    // Evita múltiplos cliques durante carregamento
    if (loading) return;
    setLoading(true);

    try {
      await twofa(codigo); // Chama API de verificação
      Alert.alert('Sucesso', 'Faça seu login novamente para entrar no sistema.');
      navigation.navigate('Login'); // Redireciona para login
    } catch (err) {
      Alert.alert('Erro', 'Código inválido ou expirado.');
    } finally {
      setLoading(false); // Finaliza loading
    }
  };

  // --------------------------
  // Render do componente
  // --------------------------
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> 
      {/* Ajusta layout quando teclado é aberto */}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        {/* Scroll para evitar sobreposição do teclado */}

        <View style={styles.container}>
          
          {/* Painel esquerdo explicativo */}
          <View style={styles.leftPainel}>
            <Text style={styles.title}>Continue o seu cadastro!</Text>
            <Text style={styles.subTitle}>
              Insira o código enviado ao seu email para confirmar a verificação.
            </Text>
          </View>

          {/* Painel direito com input e botão */}
          <View style={styles.rightPainel}>
            <Text style={styles.titleLogin}>Digite o código de verificação</Text>

            {/* Input animado para código 2FA */}
            <AnimatedInput
              label="Código"
              iconName="numeric"
              value={codigo}
              onChangeText={setCodigo}
              maxLength={6} // Código de 6 dígitos
              keyboardType="number-pad"
            />

            {/* Botão de envio */}
            <TouchableOpacity style={styles.btnAvancar} onPress={handleAvancar}>
              <Text style={styles.btnText}>Avançar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>

      {/* Overlay de loading durante requisição */}
      <LoadingOverlay visible={loading} text="Carregando..." />
    </KeyboardAvoidingView>
  );
}
