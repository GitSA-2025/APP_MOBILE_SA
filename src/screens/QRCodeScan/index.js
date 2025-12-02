import React, { useEffect, useState } from 'react';
// React e hooks de estado e efeito

import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// Componentes básicos do React Native: container, textos, botão, alertas e estilos

import { CameraView, Camera } from 'expo-camera';
// Componentes da câmera do Expo

import api from '../../api/api';
// Instância do Axios configurada para comunicação com a API

import styles from './styles';
// Estilos customizados da tela

import { useNavigation, useRoute } from '@react-navigation/native';
// Hooks para navegação e pegar parâmetros da rota

export default function ScanQRCodeScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    // Estado para saber se o usuário deu permissão para usar a câmera

    const [scanned, setScanned] = useState(false);
    // Estado para controlar se um QR Code já foi lido

    const [qrData, setQrData] = useState(null);
    // Estado para armazenar os dados do QR Code lido

    const [loading, setLoading] = useState(false);
    // Estado para mostrar loading durante requisições

    const navigation = useNavigation();
    const route = useRoute();
    const { user_email } = route.params;
    // Pegando o email do usuário logado passado pela rota

    useEffect(() => {
        // Solicita permissão para usar a câmera assim que a tela é montada
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarcodeScanned = ({ data }) => {
        // Função chamada quando um QR Code é detectado
        if (scanned) return; // Se já leu um QR Code, ignora

        try {
            const parsed = JSON.parse(data); // Tenta converter o QR Code de JSON para objeto
            setQrData(parsed);
            setScanned(true); // Marca como lido
        } catch {
            Alert.alert('Erro', 'QR Code inválido.');
            // Caso não seja um JSON válido
        }
    };

    const confirmarEntrada = async () => {
        try {
            setLoading(true);

            const qrId = qrData.qrId || null;

            // 1. Validar QR Code
            const env = await api.post('/api/validar-qrcode', { qrId });

            // 2. Se chegou aqui, é válido
            const dados = {
                nome: qrData.name,
                tipo: qrData.type_user,
                cpf: qrData.cpf,
                placa: qrData.plate,
                user_email: user_email
            };

            const res = await api.post('/api/mobile/app/criarRegistroEntrada', dados);

            Alert.alert('Sucesso', 'Entrada registrada com sucesso!');
            navigation.navigate('Home', { user_email });

            setScanned(false);
            setQrData(null);

            return { validacao: env.data, registro: res.data };

        } catch (err) {

            const msg = err.response?.data?.error || err.message;

            if (msg === 'QR Code já utilizado') {
                Alert.alert('QR Code inválido', 'Esse QR Code já foi utilizado.');
            }
            else if (msg === 'QR Code expirado') {
                Alert.alert('QR Code vencido', 'Esse QR Code já expirou.');
            }
            else if (msg === 'QR Code inválido') {
                Alert.alert('QR Code inválido', 'Esse QR Code não é válido.');
            }
            else {
                Alert.alert('Erro', 'Não foi possível validar o QR Code.');
            }

        } finally {
            setLoading(false);
        }
    };


    if (hasPermission === null) {
        // Enquanto ainda não sabe se tem permissão
        return <Text>Solicitando permissão da câmera...</Text>;
    }

    if (hasPermission === false) {
        // Caso usuário negue permissão
        return <Text>Sem acesso à câmera.</Text>;
    }

    return (
        <View style={styles.container}>
            {!scanned ? (
                // Se ainda não leu o QR Code, mostra a câmera
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'], // Apenas QR Code
                    }}
                    onBarcodeScanned={handleBarcodeScanned}
                />
            ) : (
                // Caso já tenha lido, mostra preview dos dados do QR Code
                <View style={styles.previewContainer}>
                    <Text style={styles.title}>Confirme os dados</Text>

                    <Text style={styles.info}>Nome: {qrData?.name}</Text>
                    <Text style={styles.info}>CPF: {qrData?.cpf}</Text>
                    <Text style={styles.info}>Tipo: {qrData?.type_user}</Text>

                    {qrData?.plate && <Text style={styles.info}>Placa: {qrData.plate}</Text>}
                    {qrData?.email && <Text style={styles.info}>Email: {qrData.email}</Text>}

                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.6 }]}
                        onPress={confirmarEntrada}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Registrando...' : 'Confirmar Entrada'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => {
                            setScanned(false);
                            setQrData(null);
                        }}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
