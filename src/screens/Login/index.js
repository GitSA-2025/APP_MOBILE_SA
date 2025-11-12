import { View, Text, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './styles';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../../components/LoadingOverlay';
import AnimatedInput from '../../components/AnimatedInput';

export default function Login() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function login(email, senha) {
        const dados = { email, senha };
        try {
            const res = await api.post('/api/mobile/app/login', dados);

            const { token } = res.data;

            await AsyncStorage.setItem('userToken', token);
            return token;
        } catch (err) {
            console.log('Erro ao fazer o login:', err.response?.data || err.message);
            throw err;
        }
    }

    const handleRegister = () => {
        navigation.navigate('Register');
    }

    const handleAvancar = async () => {
        if (!email || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            await login(email, senha);
            Alert.alert('Seja bem vindo!', 'Login realizado com sucesso!');
            navigation.navigate('Home', { user_email: email });
        } catch (err) {
            const msg = err.response?.data
            if (msg?.error === "Credenciais inválidas") {
                Alert.alert('Erro', 'Email ou senha inválidos.');
            } else {
                Alert.alert('Erro', 'Não foi possível realizar o login. Tente novamente.');
            }
        }
        finally{
            setLoading(true);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <View style={styles.leftPainel}>
                        <Image source={require('../../../assets/kozzy_logo_1.png')} style={{ width: '50%', height: 80 }} />
                        <Text style={styles.title}>Olá, seja bem-vindo novamente!</Text>
                        <Text style={styles.subTitle}>Conecte-se à sua conta para continuar e utilizar as funcionalidades do APP!</Text>
                    </View>

                    <View style={styles.rightPainel}>
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
                            <Text style={styles.linkText}>Esqueci a senha.</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnAvancar} onPress={handleAvancar}>
                            <Text style={styles.btnText}>Avançar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btnLinkText, { alignSelf: 'center', marginTop: 16 }]}
                            onPress={handleRegister}
                        >
                            <Text style={styles.linkText}>Não possuo login.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <LoadingOverlay visible={loading} text="Carregando..." />
        </KeyboardAvoidingView>
    );

}
