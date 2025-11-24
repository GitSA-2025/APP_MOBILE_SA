import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import api from '../../api/api';
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ScanQRCodeScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { user_email } = route.params;

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarcodeScanned = ({ data }) => {
        if (scanned) return;

        try {
            const parsed = JSON.parse(data);
            setQrData(parsed);
            setScanned(true);
        } catch {
            Alert.alert('Erro', 'QR Code inválido.');
        }
    };

    const confirmarEntrada = async () => {
        try {
            setLoading(true);

            const dados = {
                nome: qrData.name,
                tipo: qrData.type_user,
                cpf: qrData.cpf,
                placa: qrData.plate,
                user_email: user_email
            };
            
            const res = await api.post('/api/mobile/app/criarRegistroEntrada', dados);

            Alert.alert('Sucesso', 'Entrada registrada com sucesso!');
            navigation.navigate('Home', { user_email: user_email });

            // Reset
            setScanned(false);
            setQrData(null);
            
            return res.data;
        } catch (err) {
            console.error('Erro ao cadastrar:', err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    if (hasPermission === null) {
        return <Text>Solicitando permissão da câmera...</Text>;
    }

    if (hasPermission === false) {
        return <Text>Sem acesso à câmera.</Text>;
    }

    return (
        <View style={styles.container}>
            {!scanned ? (
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={handleBarcodeScanned}
                />
            ) : (
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
