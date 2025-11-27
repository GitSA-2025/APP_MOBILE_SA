import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
// Importa componentes básicos do React Native para UI, toques e scroll

import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
// Hooks para navegação, acesso à rota e efeito de foco

import { Feather, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
// Importa ícones da biblioteca Expo

import styles from './styles';
// Importa os estilos específicos da tela

import api from '../../api/api';
// Instância do Axios configurada para acessar a API

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import SearchInput from '../../components/SearchInput';
import LoadingOverlay from '../../components/LoadingOverlay';
// Componentes customizados: barra lateral, header, campo de busca e overlay de loading

import { StatusBar } from 'expo-status-bar';
// Componente para status bar do dispositivo


export default function Home() {
  // Tela principal com lista de registros de entrada

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // Estados: sidebar, registros, loading, modal de confirmação e ID selecionado

  const navigation = useNavigation();
  const route = useRoute();
  const { user_email } = route.params;
  // Hooks para navegação e recebimento do e-mail do usuário da rota anterior

  const handlerEntryRegister = () => {
    // Função para navegar para a tela de registro de entrada
    navigation.navigate('EntryRegister', { user_email: user_email });
  };

  async function marcarSaida(idregister) {
    // Marca saída de um registro específico
    try {
      setLoading(true);

      const res = await api.get(`/api/mobile/app/marcarSaidaRegistroEntrada/${idregister}`);
      console.log(res.data);
      setVisibleModal(false);
      await fetchEntradas(user_email);
      // Atualiza a lista de registros após marcar saída
    } catch (err) {
      console.error('Erro ao registrar saída:', err.response?.data || err.message);
    } finally {
      setVisibleModal(false);
      setLoading(false);
    }
  }

  async function fetchEntradas(email) {
    // Busca todos os registros de entrada do usuário
    try {
      const res = await api.post('/api/mobile/app/exibirEntradas', { user_email: email });
      setEntradas(res.data);
    } catch (err) {
      console.error('Erro ao carregar entradas:', err.response?.data);
    }
  }

  useFocusEffect(
    useCallback(() => {
      // Ao focar na tela, busca novamente os registros
      fetchEntradas(user_email);
    }, [user_email])
  );

  const handleFilterChange = async (filtro) => {
    // Filtra registros pelo termo digitado no campo de busca
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
      {/* Área segura para evitar sobreposição com status bar */}
      <StatusBar style='light' />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Sidebar lateral */}
      <View style={{ flex: 1, marginLeft: sidebarOpen ? 230 : 0 }}>
        {/* Ajusta margem dependendo do sidebar */}
        <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
        {/* Header com botão de menu */}

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <LoadingOverlay visible={loading} text="Carregando..." />
          {/* Overlay de loading durante requisições */}

          <View style={styles.registrosHeader}>
            {/* Cabeçalho da lista de registros */}
            <Text style={styles.registrosTitle}>Registros</Text>
            <TouchableOpacity
              style={styles.createEntryButton}
              activeOpacity={0.8}
              onPress={handlerEntryRegister}
            >
              {/* Botão para criar novo registro */}
              <Feather name="plus" size={20} color="white" />
              <Text style={styles.createEntryButtonText}>
                Criar registro de entrada
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableContainer}>
            {/* Container da tabela de registros */}
            <SearchInput onFilterChange={handleFilterChange} />
            {/* Campo de busca para filtrar registros */}

            {/* Cabeçalho da tabela */}
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
              // Renderiza cada registro como uma linha
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.cellDate]}>{item.date}</Text>
                <Text style={[styles.tableCell, styles.cellName]}>{item.name}</Text>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Liberado'
                      ? styles.statusLiberado
                      : styles.statusPendente,
                  ]}
                >
                  {/* Badge de status */}
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
                <View style={[styles.tableCell, styles.cellTime, { alignItems: 'center' }]}>
                  {item.hr_exit && item.hr_exit !== '-' ? (
                    <Text>{item.hr_exit}</Text>
                  ) : (
                    <TouchableOpacity
                      style={styles.exitButton}
                      onPress={() => {
                        setSelectedId(item.idregister);
                        setVisibleModal(true);
                      }}
                    >
                      {/* Botão para registrar saída */}
                      <Text style={styles.exitButtonText}>Registrar saída</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={[styles.tableCell, styles.cellPlate]}>
                  {item.car_plate || 'Ñ se aplica'}
                </Text>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    navigation.navigate('EditEntryRegister', { entry: item, user_email: user_email });
                  }}
                >
                  {/* Botão para editar registro */}
                  <Feather name="edit-2" size={14} color="white" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {visibleModal && (
          // Modal de confirmação para registrar saída
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Deseja marcar saída este registro?
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setVisibleModal(false);
                    setSelectedId(null);
                  }}
                >
                  <Text style={styles.buttonText}>Não</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => marcarSaida(selectedId)}
                >
                  <Text style={styles.buttonText}>Sim</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
