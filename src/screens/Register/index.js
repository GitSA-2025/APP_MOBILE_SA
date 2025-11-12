import { View, Text, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './styles';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/api';
import LoadingOverlay from '../../components/LoadingOverlay';

import AnimatedInput from '../../components/AnimatedInput';

export default function Register() {
    const navigation = useNavigation();

    async function cadastro(nome, email, telefone, senha) {
        const dados = { nome, email, telefone, senha };

        try {
            const res = await api.post('/api/mobile/app/cadastrar', dados);
            console.log(res.data);
            return res.data;
        } catch (err) {
            console.error('Erro ao cadastrar:', err.response?.data || err.message);
            throw err;
        }
    }

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [repetirSenha, setRepetirSenha] = useState('');

    const [loading, setLoading] = useState(false);

    const handleRegister = () => {
        navigation.navigate('Login');
    };

    const handleAvancar = async () => {
        if (!nome || !email || !telefone || !senha || !repetirSenha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }

        if (senha !== repetirSenha) {
            Alert.alert('Erro', 'As senhas não coincidem!');
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            await cadastro(nome, email, telefone, senha);
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Faça a verificação de 2 fatores.');
            navigation.navigate('TwoFA', { email });
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente.');
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
        style={{ flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
            contentContainerStyle={{ flexGrow: 1}}
            keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
            <View style={styles.leftPainel}>
                <Image source={require('../../../assets/kozzy_logo_1.png')} style={{width: '50%', height: 80}}/>
                <Text style={styles.title}>Olá, seja bem-vindo(a) novo usuário!</Text>
                <Text style={styles.subTitle}>
                    Crie a sua conta nova no SA para continuar e utilizar as funcionalidades do APP!
                </Text>
            </View>
            <ScrollView>
                <View style={styles.rightPainel}>
                    <Text style={styles.titleLogin}>Crie a sua conta</Text>
                    
                    <AnimatedInput
                        label="Nome"
                        iconName="account"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <AnimatedInput
                        label="Email"
                        iconName="email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <AnimatedInput
                        label="Telefone"
                        iconName="phone"
                        value={telefone}
                        onChangeText={setTelefone}
                        keyboardType="numeric"
                    />
                    <AnimatedInput
                        label="Senha"
                        iconName="lock"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />
                    <AnimatedInput
                        label="Repita a senha"
                        iconName="lock"
                        value={repetirSenha}
                        onChangeText={setRepetirSenha}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.btnAvancar} onPress={handleAvancar}>
                        <Text style={styles.btnText}>Avançar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btnLinkText, { alignSelf: 'center', marginTop: 16 }]}
                        onPress={handleRegister}
                    >
                        <Text style={styles.linkText}>Já possuo login.</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
            </ScrollView>
            <LoadingOverlay visible={loading} text="Carregando..." />
        </KeyboardAvoidingView>
    );
}
