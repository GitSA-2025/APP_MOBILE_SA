import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Componentes básicos do React Native

import styles from './styles';
// Importa os estilos específicos desta tela

import Ionicons from '@expo/vector-icons/Ionicons';
// Ícones do Expo

import AnimatedInput from '../../components/AnimatedInput';
import AnimatedSelect from '../../components/AnimatedSelect';
import LoadingOverlay from '../../components/LoadingOverlay';
// Componentes customizados: inputs animados, select animado e overlay de loading

import { useState, useEffect, useCallback } from 'react';
// Hooks do React

import api from '../../api/api';
// Instância do axios para chamadas à API

import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// Hooks do React Navigation


export default function EditEntryRegister() {
    // Componente principal da tela de edição de registro de entrada

    const route = useRoute();
    const navigation = useNavigation();
    const { entry } = route.params;
    // Recebe os dados do registro selecionado via parâmetros de rota

    const [nome, setNome] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('');
    const [cpf, setCpf] = useState('');
    const [data, setData] = useState('');
    const [hrEntrada, setHrEntrada] = useState('');
    const [placa, setPlaca] = useState('');
    const [senha, setSenha] = useState('');
    const [dados, setDados] = useState([]);
    const [visibleModalDelete, setVisibleModalDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    // Estados para cada campo do formulário, modal de delete, dados completos e loading

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            // Marca se o componente ainda está ativo, evitando updates após sair da tela

            const fetchDados = async () => {
                setLoading(true);
                try {
                    const res = await api.get(`/api/mobile/app/exibirEntradas/${entry.idregister}`);
                    const data = res.data;

                    setDados(data);
                    setNome(data.nome || '');
                    setTipoPessoa(data.tipo || '');
                    setCpf(data.cpf || '');
                    setData(data.data || '');
                    setPlaca(data.placa || '');
                    setHrEntrada(data.hrentrada || '');
                    // Atualiza os estados com os dados recebidos da API

                    console.log("Dados carregados:", data);
                } catch (err) {
                    console.error('Erro ao carregar entradas:', err.response?.data || err.message);
                }
                finally {
                    setLoading(false);
                }
            };

            fetchDados();

            return () => {
                isActive = false;
            };
        }, [entry.idregister])
    );
    // useFocusEffect garante que os dados sejam carregados sempre que a tela ganhar foco

    async function editar(idRegister, nome, tipoPessoa, cpf, placa) {
        const dados = { nome, tipo: tipoPessoa, cpf, placa };
        if (loading) return;
        setLoading(true);
        try {
            const res = await api.post(`/api/mobile/app/editarRegistroEntrada/${idRegister}`, dados);
            return res.data;
        } catch (err) {
            console.error('Erro ao editar:', err.response?.data || err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }
    // Função que envia os dados editados para a API

    const handleSalvar = async () => {
        if (!nome || !cpf || !tipoPessoa) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
            return;
        }

        try {
            await editar(entry.idregister, nome, tipoPessoa, cpf, placa);
            Alert.alert('Sucesso', 'Registro editado com sucesso! Retornando para tela inicial.');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível realizar a edição. Tente novamente.');
        }
    };
    // Handler do botão "Salvar", com validação de campos obrigatórios

    async function deletar(idregister) {

        try {
            const res = await api.get(`/api/mobile/app/deletarRegistroEntrada/${idregister}`);
            console.log(res.data);
            return res.data;

        } catch (err) {
            console.error('Erro ao excluir registro:', err.response?.data || err.message);
            alert("Erro ao excluir o registro!");
            throw err;
        }
    }
    // Função que envia requisição para deletar o registro

    const handleDeletar = async () => {

        if (senha !== "admin") {
            alert("Senha inválida!");
            return;
        }

        try {
            await deletar(entry.idregister);
            setVisibleModalDelete(false);
            Alert.alert('Sucesso', 'Registro deletado com sucesso! Retornando para tela inicial.');
            navigation.goBack();
        } catch (err) {
            setVisibleModalDelete(false);
            Alert.alert('Erro', 'Não foi possível deletar o registro. Tente novamente.');
        }
    };
    // Handler do botão "Deletar", com modal de confirmação

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
                        <Text style={styles.headerTitle}>Registro de entrada</Text>
                    </View>
                    {/* Cabeçalho com botão de voltar */}

                    <View style={styles.fullPainel}>
                        <View style={styles.painelLeft}>
                            {/* Lado esquerdo do formulário */}
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
                            />
                        </View>

                        <View style={styles.painelRight}>
                            {/* Lado direito do formulário */}
                            <TouchableOpacity style={styles.photo}>
                                <Ionicons name="person-outline" size={80} color="#344650" />
                            </TouchableOpacity>
                            <Text style={styles.photoText}>Foto de identificação</Text>

                            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                                <Text style={styles.btnText}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSalvar} onPress={() => setVisibleModalDelete(true)}>
                                <Text style={styles.btnText}>Deletar registro</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {visibleModalDelete && (
                // Modal de confirmação de delete
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => setVisibleModalDelete(false)}>
                            <Ionicons name="close" size={34} color="red" style={{margin: 10}}/>
                        </TouchableOpacity>
                        <Text style={styles.modalText}>
                            Insira a senha de um supervisor para confirmar a exclusão do registro:
                        </Text>

                        <AnimatedInput
                            label="Senha"
                            iconName="lock"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={handleDeletar}
                            >
                                <Text style={styles.buttonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </KeyboardAwareScrollView>
    );
}
