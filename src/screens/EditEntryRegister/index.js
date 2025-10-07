import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from './styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import AnimatedInput from '../../components/AnimatedInput';
import AnimatedSelect from '../../components/AnimatedSelect';
import { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

export default function EditEntryRegister() {
    const route = useRoute();
    const navigation = useNavigation();
    const { entry } = route.params;

    const [nome, setNome] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('');
    const [cpf, setCpf] = useState('');
    const [data, setData] = useState('');
    const [hrEntrada, setHrEntrada] = useState('');
    const [placa, setPlaca] = useState('');
    const [dados, setDados] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleModalDelete, setVisibleModalDelete] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchDados = async () => {
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

                    console.log("Dados carregados:", data);
                } catch (err) {
                    console.error('Erro ao carregar entradas:', err.response?.data || err.message);
                }
            };

            fetchDados();

            return () => {
                isActive = false;
            };

        }, [entry.idregister])
    );

    async function editar(idRegister, nome, tipoPessoa, cpf, placa) {
        const dados = { nome, tipo: tipoPessoa, cpf, placa };
        try {
            const res = await api.post(`/api/mobile/app/editarRegistroEntrada/${idRegister}`, dados);
            return res.data;
        } catch (err) {
            console.error('Erro ao editar:', err.response?.data || err.message);
            throw err;
        }
    }

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

    async function marcarSaida(idregister) {
        try {
            const res = await api.get(`/api/mobile/app/marcarSaidaRegistroEntrada/${idregister}`);
            console.log(res.data);
            return res.data;
        } catch (err) {
            console.error('Erro ao registrar saída:', err.response?.data || err.message);
            throw err;
        }
    }

    const handleSaida = async () => {
        try {
            await marcarSaida(entry.idregister);
            setVisibleModal(false);
            Alert.alert('Sucesso', 'Saída marcada com sucesso! Retornando para tela inicial.');
            navigation.goBack();
        } catch (err) {
            setVisibleModal(false);
            Alert.alert('Erro', 'Não foi possível realizar o registro de saída. Tente novamente.');
        }
    };

    async function deletar(idregister) {
        try {
            const res = await api.get(`/api/mobile/app/deletarRegistroEntrada/${idregister}`);
            console.log(res.data);
            return res.data;
        } catch (err) {
            console.error('Erro ao registrar saída:', err.response?.data || err.message);
            throw err;
        }
    }

    const handleDeletar = async () => {
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
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.painel}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Registro de entrada</Text>
                    </View>

                    <View style={styles.fullPainel}>
                        <View style={styles.painelLeft}>
                            <AnimatedInput 
                            label="Nome" 
                            iconName="account" 
                            value={nome} 
                            onChangeText={setNome} />
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
                            onChangeText={setCpf} />
                            <AnimatedInput 
                            label="Data" 
                            iconName="calendar" 
                            value={data} 
                            onChangeText={setData} 
                            editable={false} />
                            <AnimatedInput 
                            label="Horário da Entrada" 
                            iconName="clock-time-four-outline" 
                            value={hrEntrada} 
                            onChangeText={setHrEntrada} 
                            editable={false} />
                            <AnimatedInput 
                            label="Placa do Veículo" 
                            iconName="car" 
                            value={placa} 
                            onChangeText={setPlaca} />
                        </View>

                        <View style={styles.painelRight}>
                            <TouchableOpacity style={styles.photo}>
                                <Ionicons name="person-outline" size={80} color="#344650" />
                            </TouchableOpacity>
                            <Text style={styles.photoText}>Foto de identificação</Text>

                            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                                <Text style={styles.btnText}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSalvar} onPress={() => setVisibleModal(true)}>
                                <Text style={styles.btnText}>Marcar saída</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSalvar} onPress={() => setVisibleModalDelete(true)}>
                                <Text style={styles.btnText}>Deletar registro</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {visibleModal && (
                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>
                            Deseja registrar a saída deste registro?
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setVisibleModal(false)}
                            >
                                <Text style={styles.buttonText}>Não</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={handleSaida}
                            >
                                <Text style={styles.buttonText}>Sim</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {visibleModalDelete && (
                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>
                            Deseja deletar este registro?
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setVisibleModalDelete(false)}
                            >
                                <Text style={styles.buttonText}>Não</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={handleDeletar}
                            >
                                <Text style={styles.buttonText}>Sim</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
