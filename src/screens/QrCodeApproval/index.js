import {
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import styles from './styles';
import api from '../../api/api';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';



export default function QrCodeApproval() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reqs, setReqs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();


    const { user_email } = route.params;

    const fetchReqs = useCallback(async (isActive) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get('/api/mobile/app/verSolic');
            if (isActive) {
                console.log('Resposta da API:', res.data);

                setReqs(res.data);
                console.log(reqs);
            }
        } catch (err) {
            console.error('Erro ao carregar solicitações:', err.response?.data || err.message);
            if (isActive) {
                const errorMessage = err.response?.data?.message || 'Erro ao carregar solicitações.';
                if (err.response?.status === 404 && errorMessage.includes('Nenhuma solicitação')) {
                    setReqs([]);
                    console.log(reqs);
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
            let isActive = true;
            fetchReqs(isActive);
            return () => {
                isActive = false;
            };
        }, [fetchReqs])
    );

    const handleDecision = useCallback(async (id_request, decisao) => {
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

                            fetchReqs(true);
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


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='light' />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <View style={{ flex: 1, backgroundColor: '#f8f8f8', marginLeft: sidebarOpen ? 230 : 0 }}>
                <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />

                <ScrollView style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Aprovação de QRCode</Text>
                    </View>


                    {error && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text>}

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4C6EF5" />
                            <Text style={{ marginTop: 10 }}>Carregando solicitações...</Text>
                        </View>
                    ) : (
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableHeaderCell, styles.cellName]}>Nome do Requisitante</Text>
                                <Text style={[styles.tableHeaderCell, styles.cellEdit]}>Aprovar</Text>
                                <Text style={[styles.tableHeaderCell, styles.cellEdit]}>Negar</Text>
                            </View>

                            {reqs.length === 0 ? (
                                <Text style={[styles.cellName, { fontWeight: '600', margin: 20 }]}>Nenhuma solicitação pendente para aprovação.</Text>
                            ) : (
                                reqs.map((item) => (
                                    <View key={item.id || item.id} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.cellName]}>{item.name}</Text>

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
