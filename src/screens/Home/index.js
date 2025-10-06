import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import styles from './styles';
import api from '../../api/api';
import SearchInput from '../../components/SearchInput';


const Sidebar = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navigation = useNavigation();

  const handlerHome = () => {
    navigation.navigate('Home');
  };

  const handleDeliveryRegister = () => {
    navigation.navigate('DeliveryRegisterScreen');
  };

  const handleQrCodeApproval = () => {
    navigation.navigate('QrCodeApproval');
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarUser}>
        <View style={styles.userAvatar} />
        <View>
          <Text style={styles.userName}>Nome do usuário</Text>
          <Text style={styles.userRole}>Cargo de atuação</Text>
        </View>
      </View>

      <View style={styles.sidebarDivider} />

      <ScrollView style={styles.sidebarMenu} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <View>
          <TouchableOpacity style={styles.menuItem} onPress={handlerHome}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Registros</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleDeliveryRegister}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Fila de entregas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Relatórios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleQrCodeApproval}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            <Text style={styles.menuItemText}>Aprovação{'\n'}QrCode</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome5 name="user-edit" size={22} color="white" />
            <Text style={styles.menuItemText}>Editar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="settings" size={24} color="white" />
            <Text style={styles.menuItemText}>Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutButton]}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const Header = ({ onMenuPress }) => {
  return (
    <View style={[styles.header, { position: 'relative', zIndex: 100 }]}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton} activeOpacity={0.7}>
        <Feather name="menu" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Sistema de Acesso</Text>

      <SearchInput />

      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/kozzy_logo_2.png')} style={{ width: '50%', height: 80 }} />
      </View>
    </View>
  );
};




export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entradas, setEntradas] = useState([]);
  const navigation = useNavigation();

  const handlerEntryRegister = () => {
    navigation.navigate('EntryRegister');
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchEntradas = async () => {
        try {
          const res = await api.get('/api/mobile/app/exibirEntradas');
          if (isActive) setEntradas(res.data);
        } catch (err) {
          console.error('Erro ao carregar entradas:', err.response?.data);
        }
      };

      fetchEntradas();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
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

            {/* Linhas dinâmicas */}
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

                <TouchableOpacity style={styles.editButton} onPress={() => { navigation.navigate('EditEntryRegister', { entry: item }); }}>
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
