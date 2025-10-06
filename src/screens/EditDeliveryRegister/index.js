import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from './styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AnimatedInput from '../../components/AnimatedInput';
import { useState, useCallback } from 'react';
import api from '../../api/api';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

export default function EditDeliveryRegister() {
    const route = useRoute();
    const navigation = useNavigation();
    const { entry } = route.params;

    const [nome, setNome] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [telefone, setTelefone] = useState('');
    const [hrEntrada, setHrEntrada] = useState('');
    const [placa, setPlaca] = useState('');
    const [nNota, setNNota] = useState('');
    const [visibleModalDelete, setVisibleModalDelete] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchDados = async () => {
                try {
                    const res = await api.get(`/api/mobile/app/exibirEntregas/${entry.idregister}`);
                    const data = res.data;

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
        if (!nome || !fornecedor || !telefone || !placa || !nNota) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
            return;
        }

        try {
            await editar(entry.idregister, nome, fornecedor, telefone, placa, nNota, hrEntrada);
            Alert.alert('Sucesso', 'Registro editado com sucesso! Retornando para tela inicial.');
            navigation.navigate('DeliveryRegisterScreen');
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
            console.error('Erro ao deletar registro:', err.response?.data || err.message);
            throw err;
        }
    }

    const handleDeletar = async () => {
        try {
            await deletar(entry.idregister);
            setVisibleModalDelete(false);
            Alert.alert('Sucesso', 'Registro deletado com sucesso! Retornando para tela inicial.');
            navigation.navigate('DeliveryRegisterScreen');
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
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Registro de entrada</Text>
                    </View>

                    <View style={styles.fullPainel}>
                        <View style={styles.painelLeft}>
                            <AnimatedInput label="Nome" iconName="account" value={nome} onChangeText={setNome} />
                            <AnimatedInput label="Placa do Veículo" iconName="car" value={placa} onChangeText={setPlaca} />
                            <AnimatedInput label="Horário da Entrada" iconName="clock-time-four-outline" value={hrEntrada} onChangeText={setHrEntrada} />
                            <AnimatedInput label="Fornecedor" iconName="store" value={fornecedor} onChangeText={setFornecedor} />
                            <AnimatedInput label="Telefone" iconName="phone" value={telefone} onChangeText={setTelefone} />
                            <AnimatedInput label="Nº da nota" iconName="file-document-outline" value={nNota} onChangeText={setNNota} />
                        </View>

                        <View style={styles.painelRight}>
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
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Deseja deletar este registro?</Text>
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
