import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import styles from './styles';
import api from '../../api/api';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { StatusBar } from 'expo-status-bar';
import SearchInput from '../../components/SearchInput';


export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entradas, setEntradas] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { user_email } = route.params;

  const handlerEntryRegister = () => {
    navigation.navigate('EntryRegister', { user_email: user_email });
  };



  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchEntradas = async (user_email) => {
        try {
          const res = await api.post('/api/mobile/app/exibirEntradas', { user_email });
          if (isActive) setEntradas(res.data);
        } catch (err) {
          console.error('Erro ao carregar entradas:', err.response?.data);
        }
      };

      fetchEntradas(user_email);

      return () => {
        isActive = false;
      };
    }, [user_email])
  );

  const handleFilterChange = async (filtro) => {
          try {
              const res = await api.post('/api/mobile/app/filtrarEntradas', {
                  user_email,
                  filtro,
              });
              setEntradas(res.data);
          } catch (err) {
              console.error('Erro ao aplicar filtro:', err.response?.data || err.message);
          }
      };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light'/>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <View style={{ flex: 1, marginLeft: sidebarOpen ? 230 : 0 }}>
        <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.registrosHeader}>
            <Text style={styles.registrosTitle}>Registros</Text>
            <TouchableOpacity
              style={styles.createEntryButton}
              activeOpacity={0.8}
              onPress={handlerEntryRegister}
            >
              <Feather name="plus" size={20} color="white" />
              <Text style={styles.createEntryButtonText}>
                Criar registro de entrada
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableContainer}>
            <SearchInput onFilterChange={handleFilterChange} />
            {/* Cabeçalho */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.cellDate]}>Data</Text>
              <Text style={[styles.tableHeaderCell, styles.cellName]}>Nome</Text>
              <Text style={[styles.tableHeaderCell, styles.cellStatus]}>Status</Text>
              <Text style={[styles.tableHeaderCell, styles.cellTime]}>H. entrada</Text>
              <Text style={[styles.tableHeaderCell, styles.cellTime]}>H. saída</Text>
              <Text style={[styles.tableHeaderCell, styles.cellPlate]}>Placa</Text>
              <Text style={[styles.tableHeaderCell, styles.cellEdit]}></Text>
            </View>

            {entradas.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.cellDate]}>{item.date}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.cellName
                  ]}
                >
                  {item.name}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Liberado'
                      ? styles.statusLiberado
                      : styles.statusPendente,
                  ]}
                >
                  <Feather
                    name={item.status === 'Liberado' ? 'check' : 'message-circle'}
                    size={14}
                    color="white"
                  />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>

                <Text style={[styles.tableCell, styles.cellTime]}>
                  {item.hr_entry || '-'}
                </Text>
                <Text style={[styles.tableCell, styles.cellTime]}>
                  {item.hr_exit || '-'}
                </Text>
                <Text style={[styles.tableCell, styles.cellPlate]}>
                  {item.car_plate || 'Ñ se aplica'}
                </Text>

                <TouchableOpacity style={styles.editButton} onPress={() => { navigation.navigate('EditEntryRegister', { entry: item, user_email: user_email }); }}>
                  <Feather name="edit-2" size={14} color="white" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
