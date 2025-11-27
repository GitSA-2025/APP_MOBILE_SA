import {
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
// Componentes básicos do React Native: textos, botões, containers, scroll, indicador de loading e alertas

import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
// Hooks para navegação entre telas, pegar rota atual e detectar foco da tela

import styles from './styles';
// Estilos da tela

import api from '../../api/api';
// Instância do Axios configurada para comunicação com a API

import Sidebar from '../../components/Sidebar';
// Componente customizado para menu lateral

import Header from '../../components/Header';
// Componente customizado para cabeçalho

import { StatusBar } from 'expo-status-bar';
// StatusBar personalizada

import React, { useState, useCallback } from 'react';
// Hooks React: useState para estado, useCallback para memorizar funções

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Feather } from '@expo/vector-icons';
// Ícones usados na interface


export default function QrCodeApproval() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Estado que controla se o sidebar está aberto

    const [reqs, setReqs] = useState([]);
    // Estado para armazenar as solicitações de aprovação

    const [isLoading, setIsLoading] = useState(true);
    // Estado que controla se a tela está carregando

    const [error, setError] = useState(null);
    // Estado para armazenar mensagens de erro

    const navigation = useNavigation();
    const route = useRoute();
    // Hooks para navegação e pegar parâmetros da rota

    const { user_email } = route.params;
    // Email do usuário logado vindo da rota


    const fetchReqs = useCallback(async (isActive) => {
        // Função para buscar solicitações de aprovação
        setIsLoading(true);
        setError(null);

        try {
            const res = await api.get('/api/mobile/app/verSolic');
            if (isActive) {
                console.log('Resposta da API:', res.data);
                setReqs(res.data); // Atualiza o estado com os dados recebidos
            }
        } catch (err) {
            console.error('Erro ao carregar solicitações:', err.response?.data || err.message);
            if (isActive) {
                const errorMessage = err.response?.data?.message || 'Erro ao carregar solicitações.';
                if (err.response?.status === 404 && errorMessage.includes('Nenhuma solicitação')) {
                    // Caso não haja solicitações pendentes
                    setReqs([]);
                } else {
                    setError(errorMessage);
                }
            }
        } finally {
            if (isActive) setIsLoading(false);
        }
    }, []);


    useFocusEffect(
        useCallback(() => {
            // Executa fetchReqs sempre que a tela estiver em foco
            let isActive = true;
            fetchReqs(isActive);
            return () => {
                isActive = false; // Evita atualização de estado se a tela for desmontada
            };
        }, [fetchReqs])
    );


    const handleDecision = useCallback(async (id_request, decisao) => {
        // Função para aprovar ou negar uma solicitação
        Alert.alert(
            decisao === 'aprovado' ? 'Confirmar Aprovação' : 'Confirmar Negação',
            `Deseja realmente ${decisao} a solicitação?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: decisao === 'aprovado' ? 'Aprovar' : 'Negar',
                    style: decisao === 'aprovado' ? 'default' : 'destructive',
                    onPress: async () => {
                        const dados = { user_email, decisao };
                        const url = `/api/mobile/app/aprovQrCode/${id_request}`;

                        try {
                            await api.post(url, dados);
                            Alert.alert('Sucesso!', `Solicitação foi ${decisao}.`);
                            fetchReqs(true); // Atualiza a lista após decisão
                        } catch (err) {
                            const errorMessage = err.response?.data?.error || `Erro ao ${decisao} a solicitação.`;
                            console.error('Erro ao processar solicitação:', err.response?.data || err.message);
                            Alert.alert('Erro', errorMessage);
                        }
                    }
                },
            ]
        );
    }, [user_email, fetchReqs]);


    const handleQRCodeScan = () => {
        // Navega para a tela de escanear QRCode
        navigation.navigate('QRCodeScan', { user_email });
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='light' />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {/* Sidebar lateral */}

            <View style={{ flex: 1, backgroundColor: '#f8f8f8', marginLeft: sidebarOpen ? 230 : 0 }}>
                <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                {/* Cabeçalho com botão para abrir/fechar sidebar */}

                <ScrollView style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Aprovação de QRCode</Text>
                        <TouchableOpacity
                            style={styles.createEntryButton}
                            activeOpacity={0.8}
                            onPress={handleQRCodeScan}
                        >
                            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
                            <Text style={styles.createEntryButtonText}>
                                Escanear QRCode e Fazer Registro
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {error && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text>}
                    {/* Mostra mensagem de erro caso exista */}

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4C6EF5" />
                            <Text style={{ marginTop: 10 }}>Carregando solicitações...</Text>
                        </View>
                    ) : (
                        <View style={styles.tableContainer}>
                            {/* Cabeçalho da tabela */}
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableHeaderCell, styles.cellName]}>Nome do Requisitante</Text>
                                <Text style={[styles.tableHeaderCell, styles.cellName]}>CPF</Text>
                                <Text style={[styles.tableHeaderCell, styles.cellEdit]}>Aprovar</Text>
                                <Text style={[styles.tableHeaderCell, styles.cellEdit]}>Negar</Text>
                            </View>

                            {reqs.length === 0 ? (
                                <Text style={[styles.cellName, { fontWeight: '600', margin: 20 }]}>Nenhuma solicitação pendente para aprovação.</Text>
                            ) : (
                                reqs.map((item) => (
                                    <View key={item.id || item.id} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.cellName]}>{item.name}</Text>
                                        <Text style={[styles.tableCell, styles.cellName]}>{item.cpf}</Text>

                                        <TouchableOpacity
                                            style={styles.aprovButton}
                                            onPress={() => handleDecision(item.id, 'aprovado')}
                                        >
                                            <Feather name="check" size={14} color="white" />
                                            <Text style={styles.buttonText}>Aprovar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.negButton}
                                            onPress={() => handleDecision(item.id, 'negado')}
                                        >
                                            <Feather name="x" size={14} color="white" />
                                            <Text style={styles.buttonText}>Negar</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
