import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// Importa componentes básicos do React Native para interface e alertas

import styles from './styles';
// Importa os estilos específicos da tela

import Ionicons from '@expo/vector-icons/Ionicons';
// Importa ícones da biblioteca Expo Icons

import AnimatedInput from '../../components/AnimatedInput';
import AnimatedSelect from '../../components/AnimatedSelect';
import LoadingOverlay from '../../components/LoadingOverlay';
// Importa componentes customizados: input animado, select animado e overlay de loading

import { useState, useEffect } from 'react';
// Importa hooks do React para manipular estado e efeitos colaterais

import api from '../../api/api';
// Importa a instância Axios configurada para chamar a API

import { useNavigation, useRoute } from '@react-navigation/native';
// Importa hooks de navegação e acesso a parâmetros de rota

export default function EntryRegister() {
    // Componente principal da tela de registro de entrada

    const [nome, setNome] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('');
    const [cpf, setCpf] = useState('');
    const [data, setData] = useState('');
    const [hrEntrada, setHrEntrada] = useState('');
    const [placa, setPlaca] = useState('');
    const [loading, setLoading] = useState(false);
    // Estados que armazenam os valores do formulário e controle de loading

    const navigation = useNavigation();
    const route = useRoute();
    const { user_email } = route.params;
    // Hook de navegação e acesso ao parâmetro "user_email" passado pela tela anterior

    function getDataHoraAtual() {
        // Função que retorna a data e hora atual formatadas
        const now = new Date();

        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;

        const horas = String(now.getHours()).padStart(2, '0');
        const minutos = String(now.getMinutes()).padStart(2, '0');
        const segundos = String(now.getSeconds()).padStart(2, '0');
        const horaFormatada = `${horas}:${minutos}:${segundos}`;

        return { dataFormatada, horaFormatada };
    }

    useEffect(() => {
        // Executa ao montar o componente para definir data e hora automaticamente
        const { dataFormatada, horaFormatada } = getDataHoraAtual();
        setData(dataFormatada);
        setHrEntrada(horaFormatada);
    }, []);

    async function registrar(nome, tipo, cpf, placa, user_email) {
        // Função que envia os dados do registro para a API
        const dados = { nome, tipo, cpf, placa, user_email };

        try {
            const res = await api.post('/api/mobile/app/criarRegistroEntrada', dados);
            return res.data;
        } catch (err) {
            console.error('Erro ao cadastrar:', err.response?.data || err.message);
            throw err;
        }
    }

    const handleSalvar = async () => {
        // Função chamada ao pressionar o botão "Salvar"
        if (!nome || !cpf || !tipoPessoa) {
            // Valida campos obrigatórios
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
            return;
        }
        if (loading) return;
        // Evita múltiplos envios simultâneos
        setLoading(true);
        try {
            await registrar(nome, tipoPessoa, cpf, placa, user_email);
            Alert.alert('Sucesso', 'Registro salvo com sucesso! Retornando para tela inicial.');
            navigation.navigate('Home', { user_email: user_email });
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível realizar o registro. Tente novamente.');
        }
        finally {
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
            {/* Container principal */}
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.painel}>
                    {/* Painel principal da tela */}

                    <View style={styles.header}>
                        {/* Cabeçalho com botão de voltar e título */}
                        <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Registro de entrada</Text>
                    </View>

                    <View style={styles.fullPainel}>
                        {/* Área completa dividida em esquerda e direita */}

                        <View style={styles.painelLeft}>
                            {/* Lado esquerdo com formulário */}
                            <AnimatedInput
                                label="Nome"
                                iconName="account"
                                value={nome}
                                onChangeText={setNome}
                            />
                            <AnimatedSelect
                                label="Selecione o tipo de pessoa"
                                iconName="account-group"
                                options={['visitante', 'colaborador']}
                                value={tipoPessoa}
                                onSelect={setTipoPessoa}
                            />
                            <AnimatedInput
                                label="CPF"
                                iconName="badge-account-horizontal"
                                value={cpf}
                                onChangeText={setCpf}
                                placeholder="somente números"
                                mask="cpf"
                            />
                            <AnimatedInput
                                label="Data"
                                iconName="calendar"
                                value={data}
                                onChangeText={setData}
                                editable={false}
                            />
                            <AnimatedInput
                                label="Horário da Entrada"
                                iconName="clock-time-four-outline"
                                value={hrEntrada}
                                onChangeText={setHrEntrada}
                                editable={false}
                            />
                            <AnimatedInput
                                label="Placa do Veículo"
                                iconName="car"
                                value={placa}
                                onChangeText={setPlaca}
                                mask="plate"
                            />
                        </View>

                        <View style={styles.painelRight}>
                            {/* Lado direito com foto e botão de salvar */}
                            <TouchableOpacity style={styles.photo}>
                                <Ionicons name="person-outline" size={80} color="#344650" />
                            </TouchableOpacity>
                            <Text style={styles.photoText}>Foto de identificação</Text>

                            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                                <Text style={styles.btnText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <LoadingOverlay visible={loading} text="Enviando..." />
            {/* Overlay exibido enquanto a requisição está em andamento */}
        </KeyboardAwareScrollView>
    );
}
