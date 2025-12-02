import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// Importa componentes básicos do React Native

import styles from './styles';
// Importa estilos específicos deste componente

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// Importa ícones do Expo

import AnimatedInput from '../../components/AnimatedInput';
// Importa componente customizado de input animado

import LoadingOverlay from '../../components/LoadingOverlay';
// Importa overlay de carregamento

import { useState, useEffect } from 'react';
// Importa hooks do React

import { useNavigation, useRoute } from '@react-navigation/native';
// Importa hooks de navegação do React Navigation

import api from '../../api/api';
// Importa instância axios configurada para chamadas API

export default function DeliveryRegister() {
    // Componente principal de registro de entregas

    const [nome, setNome] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [telefone, setTelefone] = useState('');
    const [hrEntrada, setHrEntrada] = useState('');
    const [placa, setPlaca] = useState('');
    const [nNota, setNNota] = useState('');
    const [loading, setLoading] = useState(false);
    // Declara estados para cada campo do formulário e loading

    const navigation = useNavigation();
    const route = useRoute();
    const { user_email } = route.params;
    // Hooks de navegação e captura de parâmetros da rota

    function getDataHoraAtual() {
        // Função para retornar hora atual formatada
        const now = new Date();

        const horas = String(now.getHours()).padStart(2, '0');
        const minutos = String(now.getMinutes()).padStart(2, '0');
        const segundos = String(now.getSeconds()).padStart(2, '0');
        const horaFormatada = `${horas}:${minutos}:${segundos}`;

        return { horaFormatada };
    }

    useEffect(() => {
        // Ao montar o componente, define a hora atual no input de entrada
        const { horaFormatada } = getDataHoraAtual();
        setHrEntrada(horaFormatada);
    }, []);

    async function registrar(nome, fornecedor, telefone, placa, nNota, user_email) {
        // Função para enviar dados ao backend
        const dados = {
            nome,
            telefone,
            placa,
            industria: fornecedor,
            n_fiscal: nNota,
            user_email
        };

        try {
            const res = await api.post('/api/mobile/app/criarRegistroEntrega', dados);
            return res.data; // Retorna a resposta da API
        } catch (err) {
            console.error('Erro ao cadastrar:', err.response?.data || err.message);
            console.log(dados); // Log dos dados para debug
            throw err; // Propaga o erro
        }
    }

    const handleSalvar = async () => {
        // Função chamada ao clicar em "Salvar"
        if (!nome || !fornecedor || !telefone || !placa || !nNota) {
            // Valida se todos os campos obrigatórios estão preenchidos
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
            return;
        }

        if (loading) return; // Evita múltiplos cliques
        setLoading(true); // Ativa overlay de loading

        try {
            await registrar(nome, fornecedor, telefone, placa, nNota, user_email);
            Alert.alert('Sucesso', 'Registro salvo com sucesso! Retornando para tela inicial.');
            navigation.goBack(); // Retorna à tela anterior
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível realizar o registro. Tente novamente.');
        }
        finally {
            setLoading(false); // Desativa overlay
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
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.painel}>

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Registro de entrega</Text>
                    </View>
                    {/* Cabeçalho com botão de voltar e título */}

                    <View style={styles.fullPainel}>
                        <View style={styles.painelLeft}>
                            {/* Inputs do formulário */}
                            <AnimatedInput
                                label="Nome"
                                iconName="account"
                                value={nome}
                                onChangeText={setNome}
                            />
                            <AnimatedInput
                                label="Placa do Veículo"
                                iconName="car"
                                value={placa}
                                onChangeText={setPlaca}
                                mask="plate"
                            />
                            <AnimatedInput
                                label="Horário da Entrada"
                                iconName="clock-time-four-outline"
                                value={hrEntrada}
                                onChangeText={setHrEntrada}
                                editable={false} // Campo não editável
                            />
                            <AnimatedInput
                                label="Fornecedor"
                                iconName="store"
                                value={fornecedor}
                                onChangeText={setFornecedor}
                            />
                            <AnimatedInput
                                label="Telefone"
                                iconName="phone"
                                value={telefone}
                                onChangeText={setTelefone}
                                keyboardType="phone-pad"
                                placeholder='11999999999'
                                mask="phone"
                            />
                            <AnimatedInput
                                label="Nº da nota"
                                iconName="file-document-outline"
                                value={nNota}
                                onChangeText={setNNota}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.painelRight}>
                            {/* Área da foto e botão de salvar */}
                            <TouchableOpacity style={styles.photo}>
                                <MaterialCommunityIcons name="truck-minus" size={80} color="#344650" />
                            </TouchableOpacity>
                            <Text style={styles.photoText}>Foto da placa do veículo</Text>

                            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                                <Text style={styles.btnText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <LoadingOverlay visible={loading} text="Carregando..." />
            {/* Overlay mostrado enquanto o loading está ativo */}
        </KeyboardAwareScrollView>
    );
}
