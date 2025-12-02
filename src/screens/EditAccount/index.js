import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// Componentes básicos do React Native

import styles from './styles';
// Importa os estilos da tela

import Ionicons from '@expo/vector-icons/Ionicons';
// Ícones do Expo

import AnimatedInput from '../../components/AnimatedInput';
// Input animado customizado

import { useState, useCallback } from 'react';
// Hooks do React

import api from '../../api/api';
// Instância do axios para chamadas API

import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// Hooks do React Navigation


export default function EditAccount() {
    // Componente principal da tela de edição de conta

    const route = useRoute();
    const navigation = useNavigation();
    const { user_email } = route.params;
    // Recebe o registro selecionado via parâmetros de rota

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [emailUser, setEmailUser] = useState('');
    const [dados, setDados] = useState({});
    // Estados para cada campo do formulário

    async function fetchConta(email) {
        try {
            const res = await api.post('/api/mobile/app/conta', { user_email: email });
            const usuario = res.data;

            setDados(usuario);
            setNome(usuario.name);
            setTelefone(usuario.phone);
            setEmailUser(usuario.user_email);

        } catch (err) {
            console.error('Erro ao carregar conta:', err.response?.data);
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (user_email) {
                fetchConta(user_email);
            }
        }, [user_email])
    );

    async function editar(user_email, nome, telefone) {
        // Função que envia os dados editados para a API
        const dados = {
            nome,
            telefone,
            user_email
        };
        try {
            const res = await api.post(`/api/mobile/app/editarPerfil`, dados);
            return res.data;
        } catch (err) {
            console.error('Erro ao editar:', err.response?.data || err.message);
            throw err;
        }
    }

    const handleSalvar = async () => {
        // Validação de campos obrigatórios
        if (!nome || !telefone || !emailUser) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
            return;
        }

        try {
            await editar(user_email, nome, telefone);
            Alert.alert('Sucesso', 'Conta editada com sucesso! Retornando para tela inicial.');
            navigation.goBack(); // Retorna à tela anterior
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível realizar a edição. Tente novamente.');
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.painel}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Editar conta</Text>
                    </View>
                    {/* Cabeçalho com botão de voltar */}

                    <View style={styles.fullPainel}>
                        <View style={styles.painelLeft}>
                            {/* Lado esquerdo do formulário */}
                            <AnimatedInput label="Nome" iconName="account" value={nome} onChangeText={setNome} />
                            <AnimatedInput label="Telefone" iconName="phone" value={telefone} onChangeText={setTelefone} />
                            <AnimatedInput label="Email" iconName="email" value={emailUser} onChangeText={setEmailUser} />
                        </View>

                        <View style={styles.painelRight}>
                            {/* Lado direito do formulário */}
                            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                                <Text style={styles.btnText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}
