import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// Componentes básicos do React Native

import styles from './styles';
// Importa os estilos da tela

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// Ícones do Expo

import AnimatedInput from '../../components/AnimatedInput';
// Input animado customizado

import { useState, useCallback } from 'react';
// Hooks do React

import api from '../../api/api';
// Instância do axios para chamadas API

import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// Hooks do React Navigation


export default function EditDeliveryRegister() {
    // Componente principal da tela de edição de registro de entrega

    const route = useRoute();
    const navigation = useNavigation();
    const { entry } = route.params;
    // Recebe o registro selecionado via parâmetros de rota

    const [nome, setNome] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [telefone, setTelefone] = useState('');
    const [hrEntrada, setHrEntrada] = useState('');
    const [placa, setPlaca] = useState('');
    const [nNota, setNNota] = useState('');
    const [senha, setSenha] = useState('');
    const [visibleModalDelete, setVisibleModalDelete] = useState(false);
    // Estados para cada campo do formulário e modal de delete

    useFocusEffect(
        useCallback(() => {
            const fetchDados = async () => {
                // Função que carrega os dados do registro quando a tela ganha foco
                try {
                    const res = await api.get(`/api/mobile/app/exibirEntregas/${entry.idregister}`);
                    const data = res.data;

                    // Atualiza estados com os dados retornados
                    setNome(data.nome || '');
                    setFornecedor(data.industria || '');
                    setTelefone(data.telefone || data.cpf || '');
                    setPlaca(data.placa || '');
                    setHrEntrada(data.hrentrada || '');
                    setNNota(data.n_nota || '');

                    console.log("Dados carregados:", data);
                } catch (err) {
                    console.error('Erro ao carregar entradas:', err.response?.data || err.message);
                }
            };

            fetchDados();
        }, [entry.idregister])
    );

    async function editar(idRegister, nome, fornecedor, telefone, placa, nNota, hrEntrada) {
        // Função que envia os dados editados para a API
        const dados = {
            nome,
            telefone,
            placa,
            industria: fornecedor,
            n_fiscal: nNota,
            hrentrada: hrEntrada,
        };
        try {
            const res = await api.post(`/api/mobile/app/editarRegistroEntrega/${idRegister}`, dados);
            return res.data;
        } catch (err) {
            console.error('Erro ao editar:', err.response?.data || err.message);
            throw err;
        }
    }

    const handleSalvar = async () => {
        // Validação de campos obrigatórios
        if (!nome || !fornecedor || !telefone || !placa || !nNota) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
            return;
        }

        try {
            await editar(entry.idregister, nome, fornecedor, telefone, placa, nNota, hrEntrada);
            Alert.alert('Sucesso', 'Registro editado com sucesso! Retornando para tela inicial.');
            navigation.goBack(); // Retorna à tela anterior
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível realizar a edição. Tente novamente.');
        }
    };

    async function deletar(idregister) {

        try {
            const res = await api.get(`/api/mobile/app/deletarRegistroEntrega/${idregister}`);
            console.log(res.data);
            return res.data;

        } catch (err) {
            console.error('Erro ao excluir registro:', err.response?.data || err.message);
            alert("Erro ao excluir o registro!");
            throw err;
        }
    }

    const handleDeletar = async () => {
        // Handler para o botão de confirmar delete

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
                            <AnimatedInput label="Nome" iconName="account" value={nome} onChangeText={setNome} />
                            <AnimatedInput label="Placa do Veículo" iconName="car" value={placa} onChangeText={setPlaca} />
                            <AnimatedInput label="Horário da Entrada" iconName="clock-time-four-outline" value={hrEntrada} onChangeText={setHrEntrada} editable={false} />
                            <AnimatedInput label="Fornecedor" iconName="store" value={fornecedor} onChangeText={setFornecedor} />
                            <AnimatedInput label="Telefone" iconName="phone" value={telefone} onChangeText={setTelefone} />
                            <AnimatedInput label="Nº da nota" iconName="file-document-outline" value={nNota} onChangeText={setNNota} keyboardType="numeric" />
                        </View>

                        <View style={styles.painelRight}>
                            {/* Lado direito do formulário */}
                            <TouchableOpacity style={styles.photo}>
                                <MaterialCommunityIcons name="truck-minus" size={80} color="#344650" />
                            </TouchableOpacity>
                            <Text style={styles.photoText}>Foto da placa do veículo</Text>

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
