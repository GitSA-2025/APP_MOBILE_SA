import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    Feather,
    MaterialCommunityIcons,
    FontAwesome5,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Sidebar = ({ isOpen, onClose }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user_email } = route.params;

    if (!isOpen) return null;

    const handlerHome = () => {
        navigation.navigate('Home', { user_email });
    };

    const handleDeliveryRegister = () => {
        navigation.navigate('DeliveryRegisterScreen', { user_email });
    };

    const handleReports = () => {
        navigation.navigate('Reports', { user_email });
    };

    const handleQrCodeApproval = () => {
        navigation.navigate('QrCodeApproval');
    };

    const handleLogout = () => {
        AsyncStorage.removeItem('userToken');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

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

            <ScrollView
                style={styles.sidebarMenu}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
            >
                <View>
                    <TouchableOpacity style={styles.menuItem} onPress={handlerHome}>
                        <MaterialCommunityIcons name="clock-outline" size={24} color="white" />
                        <Text style={styles.menuItemText}>Registros</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={handleDeliveryRegister}>
                        <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="white" />
                        <Text style={styles.menuItemText}>Fila de entregas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={handleReports}>
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

                    <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        width: 230,
        height: '100%',
        backgroundColor: '#2B3D52',
        paddingTop: 40,
        paddingHorizontal: 16,
        zIndex: 10,
        justifyContent: 'space-between',
    },

    sidebarUser: {
        flexDirection: 'row',
        paddingBottom: 12,
        borderBottomColor: 'rgba(255,255,255,0.3)',
        borderBottomWidth: 1,
        marginBottom: 20,
        alignItems: 'center',
    },

    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginRight: 12,
    },

    userName: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 2,
    },

    userRole: {
        color: 'white',
        fontSize: 12,
        opacity: 0.7,
    },

    sidebarDivider: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
        marginBottom: 24,
    },

    sidebarMenu: {},

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },

    menuItemText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 12,
    },

    logoutButton: {
        backgroundColor: 'white',
        borderRadius: 6,
        paddingVertical: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
        width: '60%',
    },

    logoutButtonText: {
        color: '#2B3D52',
        fontWeight: '700',
    },
});

export default Sidebar;
