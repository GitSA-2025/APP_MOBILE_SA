import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import styles from './styles';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/api';
import LoadingOverlay from '../../components/LoadingOverlay';
import AnimatedInput from '../../components/AnimatedInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Register() {
    const navigation = useNavigation();

    // Função que realiza o cadastro via API
    async function cadastro(nome, email, telefone, senha) {
        const dados = { nome, email, telefone, senha };
        try {
            const res = await api.post('/api/mobile/app/cadastrar', dados);
            console.log(res.data);
            return res.data;
        } catch (err) {
            console.error('Erro ao cadastrar:', err.response?.data || err.message);
            throw err; // Propaga o erro para tratar no handleAvancar
        }
    }

    // Estados para armazenar os campos do formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [repetirSenha, setRepetirSenha] = useState('');
    const [loading, setLoading] = useState(false); // Controle de loading durante requisições

    // Navegação para tela de login
    const handleRegister = () => {
        navigation.navigate('Login');
    };

    // Função chamada ao clicar em "Avançar"
    const handleAvancar = async () => {
        // Validação de campos obrigatórios
        if (!nome || !email || !telefone || !senha || !repetirSenha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }

        // Validação de senhas iguais
        if (senha !== repetirSenha) {
            Alert.alert('Erro', 'As senhas não coincidem!');
            return;
        }

        // Evita múltiplos cliques durante carregamento
        if (loading) return;
        setLoading(true);

        try {
            // Chama a API para cadastrar
            await cadastro(nome, email, telefone, senha);
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Faça a verificação de 2 fatores.');
            // Navega para tela de TwoFA passando o email
            navigation.navigate('TwoFA', { email });
        } catch (err) {
            // Mostra erro genérico em caso de falha na API
            Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled" // Permite tocar em botões mesmo com teclado aberto
            >
                <View style={styles.container}>
                    {/* Painel esquerdo com logo e informações */}
                    <View style={styles.leftPainel}>
                        <Image source={require('../../../assets/kozzy_logo_1.png')} style={{ width: '50%', height: 80 }} />
                        <Text style={styles.title}>Olá, seja bem-vindo(a) novo usuário!</Text>
                        <Text style={styles.subTitle}>
                            Crie a sua conta nova no SA para continuar e utilizar as funcionalidades do APP!
                        </Text>
                    </View>

                    <ScrollView>
                        {/* Painel direito com formulário */}
                        <View style={styles.rightPainel}>
                            <Text style={styles.titleLogin}>Crie a sua conta</Text>

                            {/* Campos do formulário com animação */}
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
                                keyboardType="email-address" // Teclado específico para emails
                            />
                            <AnimatedInput
                                label="Telefone"
                                iconName="phone"
                                value={telefone}
                                onChangeText={setTelefone}
                                keyboardType="numeric" // Teclado numérico
                            />
                            <AnimatedInput
                                label="Senha"
                                iconName="lock"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry // Oculta senha
                            />
                            <AnimatedInput
                                label="Repita a senha"
                                iconName="lock"
                                value={repetirSenha}
                                onChangeText={setRepetirSenha}
                                secureTextEntry
                            />

                            {/* Botão Avançar */}
                            <TouchableOpacity style={styles.btnAvancar} onPress={handleAvancar}>
                                <Text style={styles.btnText}>Avançar</Text>
                            </TouchableOpacity>

                            {/* Botão para voltar ao login */}
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

            {/* Overlay de carregamento */}
            <LoadingOverlay visible={loading} text="Carregando..." />
        </KeyboardAwareScrollView>
    );
}
