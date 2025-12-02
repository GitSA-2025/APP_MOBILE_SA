import React, { useState, useEffect, useCallback } from 'react';
// Importa hooks do React

import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ScrollView,
    Image
} from 'react-native';
// Importa componentes básicos do React Native

import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
// Hooks do React Navigation: navegação, foco de tela e parâmetros de rota

import { Feather, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
// Ícones do Expo

import styles from './styles';
// Importa estilos específicos da tela

import SearchInput from '../../components/SearchInput';
// Input de busca com filtros

import api from '../../api/api';
// Instância do axios para requisições API

import Sidebar from '../../components/Sidebar';
// Sidebar lateral

import Header from '../../components/Header';
// Header customizado

import { StatusBar } from 'expo-status-bar';
// Barra de status

import LoadingOverlay from '../../components/LoadingOverlay';
// Overlay de carregamento


export default function DeliveryRegisterScreen() {
    // Componente principal da tela de registros de entrega

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(false);
    // Estados: sidebar aberta, lista de entregas e loading

    const navigation = useNavigation();
    const route = useRoute();
    const { user_email } = route.params;
    // Hook de navegação e captura de parâmetro "user_email"

    useFocusEffect(
        useCallback(() => {
            // Função que executa sempre que a tela entra em foco
            let isActive = true; // Flag para controle de componente ativo

            const fetchEntregas = async () => {
                setLoading(true); // Ativa loading
                try {
                    const res = await api.post('/api/mobile/app/exibirEntregas', { user_email });
                    if (res && res.data) {
                        setEntregas(res.data); // Atualiza lista de entregas
                    } else {
                        console.warn('Nenhum dado retornado da API');
                        setEntregas([]); // Caso nenhum dado
                    }
                } catch (err) {
                    console.error('Erro ao carregar entregas:', err.response?.data || err.message);
                    setEntregas([]); // Em caso de erro, limpa lista
                }
                finally{
                    setLoading(false); // Desativa loading
                }
            };

            fetchEntregas(user_email); // Executa a função

            return () => {
                isActive = false; // Limpeza ao sair da tela
            };
        }, [])
    );

    const handlerDeliveryRegister = () => {
        // Navega para tela de criação de registro
        navigation.navigate('DeliveryRegister', { user_email: user_email });
    };

    const handleFilterChange = async (filtro) => {
        // Função passada para o SearchInput
        try {
            const res = await api.post('/api/mobile/app/filtrarEntregas', {
                user_email,
                filtro,
            });
            setEntregas(res.data); // Atualiza lista filtrada
        } catch (err) {
            console.error('Erro ao aplicar filtro:', err.response?.data || err.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Container seguro para dispositivos com notch */}
            <StatusBar style='light' />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {/* Sidebar lateral */}
            <View style={{ flex: 1, marginLeft: sidebarOpen ? 230 : 0 }}>
                {/* Desloca conteúdo quando sidebar aberta */}
                <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                {/* Header com botão de menu */}

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.registrosHeader}>
                        <Text style={styles.registrosTitle}>Fila de entregas</Text>
                        <TouchableOpacity style={styles.createEntryButton} activeOpacity={0.8} onPress={handlerDeliveryRegister}>
                            <Feather name="plus" size={20} color="white" />
                            <Text style={styles.createEntryButtonText}>Criar registro de entrega</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Cabeçalho da tabela com botão de criar registro */}

                    <View style={styles.tableContainer}>
                        <SearchInput onFilterChange={handleFilterChange} />
                        {/* Input de busca e filtros */}
                        <View style={styles.tableHeaderRow}>
                            {/* Cabeçalho da tabela */}
                            <Text style={[styles.tableHeaderCell, styles.cellDate]}>Data</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellName]}>Nome</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellStatus]}>Status</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellTime]}>H. entrada</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellTime]}>Fornecedor</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellPlate]}>Placa</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellEdit]}></Text>
                        </View>

                        {entregas.map((item, index) => (
                            // Mapeia cada entrega
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.cellDate]}>{item.date_fixed}</Text>
                                <Text style={[styles.tableCell, styles.cellName]}>{item.name}</Text>
                                <View style={[styles.statusBadge, styles.statusLiberado]}>
                                    <Feather name="check" size={14} color="white" />
                                    <Text style={styles.statusText}>Liberado</Text>
                                </View>
                                <Text style={[styles.tableCell, styles.cellTime]}>{item.hr_entry}</Text>
                                <Text style={[styles.tableCell, styles.cellTime]}>{item.industry}</Text>
                                <Text style={[styles.tableCell, styles.cellPlate]}>{item.plate_vehicle}</Text>
                                <TouchableOpacity style={styles.editButton} onPress={() => { navigation.navigate('EditDeliveryRegister', { entry: item }); }}>
                                    <Feather name="edit-2" size={14} color="white" />
                                    <Text style={styles.editButtonText}>Editar</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {/* Fim do mapeamento da lista */}
                    </View>
                </ScrollView>
                <LoadingOverlay visible={loading} text="Carregando..." />
                {/* Overlay mostrado enquanto o loading está ativo */}
            </View>
        </SafeAreaView>
    );
}
