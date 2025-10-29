import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import styles from './styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AnimatedInput from '../../components/AnimatedInput';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../api/api';

export default function DeliveryRegister() {
    const [nome, setNome] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [telefone, setTelefone] = useState('');
    const [hrEntrada, setHrEntrada] = useState('');
    const [placa, setPlaca] = useState('');
    const [nNota, setNNota] = useState('');

    const navigation = useNavigation();
    const route = useRoute();
    const { user_email } = route.params;

    function getDataHoraAtual() {
        const now = new Date();

        const horas = String(now.getHours()).padStart(2, '0');
        const minutos = String(now.getMinutes()).padStart(2, '0');
        const segundos = String(now.getSeconds()).padStart(2, '0');
        const horaFormatada = `${horas}:${minutos}:${segundos}`;

        return { horaFormatada };
    }

    useEffect(() => {
        const { horaFormatada } = getDataHoraAtual();
        setHrEntrada(horaFormatada);
    }, []);

    async function registrar(nome, fornecedor, telefone, placa, nNota, user_email) {
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
            return res.data;
        } catch (err) {
            console.error('Erro ao cadastrar:', err.response?.data || err.message);
            console.log(dados);
            throw err;
        }
    }

    const handleSalvar = async () => {
        if (!nome || !fornecedor || !telefone || !placa || !nNota) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
            return;
        }

        try {
            await registrar(nome, fornecedor, telefone, placa, nNota, user_email);
            Alert.alert('Sucesso', 'Registro salvo com sucesso! Retornando para tela inicial.');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível realizar o registro. Tente novamente.');
        }
    };

    return (
        <View style={styles.container}>
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


                    <View style={styles.fullPainel}>

                        <View style={styles.painelLeft}>
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
                            />
                            <AnimatedInput
                                label="Horário da Entrada"
                                iconName="clock-time-four-outline"
                                value={hrEntrada}
                                onChangeText={setHrEntrada}
                                editable={false}
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
        </View>
    );
}
