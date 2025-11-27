import { View, Text, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// Importa componentes básicos do React Native: View, Text, botões, alertas, imagens, teclado e scroll

import styles from './styles';
// Importa estilos da tela

import { useState } from 'react';
// Hook para gerenciar estado

import { useNavigation } from '@react-navigation/native';
// Hook para navegação entre telas

import api from '../../api/api';
// Instância do Axios configurada para comunicação com a API

import AsyncStorage from '@react-native-async-storage/async-storage';
// Biblioteca para armazenamento local de dados (token, por exemplo)

import LoadingOverlay from '../../components/LoadingOverlay';
// Componente customizado para exibir overlay de loading

import AnimatedInput from '../../components/AnimatedInput';
// Componente customizado de input com animação


export default function Login() {
    const navigation = useNavigation();
    // Hook para navegação

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    // Estados para armazenar email, senha e controlar loading

    async function login(email, senha) {
        // Função para autenticar o usuário
        const dados = { email, senha };
        try {
            const res = await api.post('/api/mobile/app/login', dados);
            // Chamada à API para login

            const { token } = res.data;
            // Extrai o token retornado pela API

            await AsyncStorage.setItem('userToken', token);
            // Armazena token no AsyncStorage para uso futuro
            return token;
        } catch (err) {
            console.log('Erro ao fazer o login:', err.response?.data || err.message);
            throw err;
        }
    }

    const handleRegister = () => {
        // Navega para a tela de cadastro
        navigation.navigate('Register');
    }

    const handleAvancar = async () => {
        // Função chamada ao pressionar "Avançar"
        if (!email || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }

        if (loading) return; // Evita múltiplos cliques
        setLoading(true);

        try {
            await login(email, senha);
            Alert.alert('Seja bem vindo!', 'Login realizado com sucesso!');
            // Navega para a tela Home passando o email do usuário
            navigation.navigate('Home', { user_email: email });
        } catch (err) {
            const msg = err.response?.data;
            if (msg?.error === "Credenciais inválidas") {
                Alert.alert('Erro', 'Email ou senha inválidos.');
            } else {
                Alert.alert('Erro', 'Não foi possível realizar o login. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Evita que o teclado sobreponha os inputs */}
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Permite scroll no conteúdo e mantém toque em botões mesmo com teclado */}
                <View style={styles.container}>
                    <View style={styles.leftPainel}>
                        {/* Painel esquerdo com logo e mensagem de boas-vindas */}
                        <Image source={require('../../../assets/kozzy_logo_1.png')} style={{ width: '50%', height: 80 }} />
                        <Text style={styles.title}>Olá, seja bem-vindo novamente!</Text>
                        <Text style={styles.subTitle}>Conecte-se à sua conta para continuar e utilizar as funcionalidades do APP!</Text>
                    </View>

                    <View style={styles.rightPainel}>
                        {/* Painel direito com formulário de login */}
                        <Text style={styles.titleLogin}>Faça login no SA</Text>
                        <AnimatedInput
                            label="Email"
                            iconName="email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                        <AnimatedInput
                            label="Senha"
                            iconName="lock"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                        />

                        <TouchableOpacity style={styles.btnLinkText}>
                            {/* Link para recuperação de senha */}
                            <Text style={styles.linkText}>Esqueci a senha.</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnAvancar} onPress={handleAvancar}>
                            {/* Botão principal para login */}
                            <Text style={styles.btnText}>Avançar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btnLinkText, { alignSelf: 'center', marginTop: 16 }]}
                            onPress={handleRegister}
                        >
                            {/* Link para registrar nova conta */}
                            <Text style={styles.linkText}>Não possuo login.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <LoadingOverlay visible={loading} text="Carregando..." />
            {/* Overlay de carregamento enquanto o login é processado */}
        </KeyboardAvoidingView>
    );
}
