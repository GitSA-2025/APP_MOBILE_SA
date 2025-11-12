import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import styles from './styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import AnimatedInput from '../../components/AnimatedInput';
import AnimatedSelect from '../../components/AnimatedSelect';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function EntryRegister() {
    const [nome, setNome] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('');
    const [cpf, setCpf] = useState('');
    const [data, setData] = useState('');
    const [hrEntrada, setHrEntrada] = useState('');
    const [placa, setPlaca] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { user_email } = route.params;

    function getDataHoraAtual() {
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
        const { dataFormatada, horaFormatada } = getDataHoraAtual();
        setData(dataFormatada);
        setHrEntrada(horaFormatada);
    }, []);

    async function registrar(nome, tipo, cpf, placa, user_email) {
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
        if (!nome || !cpf || !tipoPessoa) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
            return;
        }
        if (loading) return;
        setLoading(true);
        try {
            
            await registrar(nome, tipoPessoa, cpf, placa, user_email);
            Alert.alert('Sucesso', 'Registro salvo com sucesso! Retornando para tela inicial.');
            navigation.navigate('Home', { user_email: user_email });
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível realizar o registro. Tente novamente.');
        }
        finally{
            setLoading(false);
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
                        <Text style={styles.headerTitle}>Registro de entrada</Text>
                    </View>


                    <View style={styles.fullPainel}>

                        <View style={styles.painelLeft}>
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
                                keyboardType="numeric"
                                placeholder="somente números"
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
        </View>
    );
}
