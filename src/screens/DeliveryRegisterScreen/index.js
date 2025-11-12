import React, { useState, useEffect, useCallback } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ScrollView,
    Image
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import styles from './styles';
import SearchInput from '../../components/SearchInput';
import api from '../../api/api';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { StatusBar } from 'expo-status-bar';
import LoadingOverlay from '../../components/LoadingOverlay';


export default function DeliveryRegisterScreen() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { user_email } = route.params;

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchEntregas = async () => {

                setLoading(true);
                try {
                    const res = await api.post('/api/mobile/app/exibirEntregas', { user_email });
                    if (res && res.data) {
                        setEntregas(res.data);
                    } else {
                        console.warn('Nenhum dado retornado da API');
                        setEntregas([]);
                    }
                } catch (err) {
                    console.error('Erro ao carregar entregas:', err.response?.data || err.message);
                    setEntregas([]);
                }
                finally{
                    setLoading(false);
                }
            };

            fetchEntregas(user_email);

            return () => {
                isActive = false;
            };
        }, [])
    );

    const handlerDeliveryRegister = () => {
        navigation.navigate('DeliveryRegister', { user_email: user_email });
    };

    const handleFilterChange = async (filtro) => {
        try {
            const res = await api.post('/api/mobile/app/filtrarEntregas', {
                user_email,
                filtro,
            });
            setEntregas(res.data);
        } catch (err) {
            console.error('Erro ao aplicar filtro:', err.response?.data || err.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='light' />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <View style={{ flex: 1, marginLeft: sidebarOpen ? 230 : 0 }}>
                <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.registrosHeader}>
                        <Text style={styles.registrosTitle}>Fila de entregas</Text>
                        <TouchableOpacity style={styles.createEntryButton} activeOpacity={0.8} onPress={handlerDeliveryRegister}>
                            <Feather name="plus" size={20} color="white" />
                            <Text style={styles.createEntryButtonText}>Criar registro de entrega</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tableContainer}>
                        <SearchInput onFilterChange={handleFilterChange} />
                        <View style={styles.tableHeaderRow}>
                            <Text style={[styles.tableHeaderCell, styles.cellDate]}>Data</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellName]}>Nome</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellStatus]}>Status</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellTime]}>H. entrada</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellTime]}>Fornecedor</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellPlate]}>Placa</Text>
                            <Text style={[styles.tableHeaderCell, styles.cellEdit]}></Text>
                        </View>

                        {entregas.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.cellDate]}>{item.date}</Text>
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


                    </View>
                </ScrollView>
                <LoadingOverlay visible={loading} text="Carregando..." />
            </View>
        </SafeAreaView>
    );
}


