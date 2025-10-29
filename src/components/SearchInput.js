import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchInput = ({ onFilterChange }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const toggleFilter = () => setIsFilterVisible(!isFilterVisible);

    const handleFilterSelect = (filtro) => {
        onFilterChange(filtro);  // <- envia o tipo de filtro para o componente pai
        setIsFilterVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <Feather name="search" size={20} color="#2B3D52" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar"
                    placeholderTextColor="#2B3D52"
                />
                <TouchableOpacity onPress={toggleFilter}>
                    <Feather name="filter" size={20} color="#2B3D52" />
                </TouchableOpacity>
            </View>

            {isFilterVisible && (
                <View style={styles.filterBox}>
                    <Text style={styles.filterTitle}>Filtros</Text>

                    <TouchableOpacity style={styles.optionFilter} onPress={() => handleFilterSelect('data_crescente')}>
                        <Text>Data ↑</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionFilter} onPress={() => handleFilterSelect('data_decrescente')}>
                        <Text>Data ↓</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionFilter} onPress={() => handleFilterSelect('hora_crescente')}>
                        <Text>Hora Entrada ↑</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionFilter} onPress={() => handleFilterSelect('hora_decrescente')}>
                        <Text>Hora Entrada ↓</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({ container: { padding: 10, position: 'relative', }, searchBox: { backgroundColor: '#fff', borderRadius: 4, flexDirection: 'row', paddingHorizontal: 8, alignItems: 'center', height: 40, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2, width: 200, }, searchInput: { marginLeft: 6, fontSize: 16, color: '#2B3D52', flex: 1, height: 32, }, filterBox: { position: 'relative', top: 0, right: 0, left: 150, width: 200, backgroundColor: '#fff', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#ddd', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 10, zIndex: 200 }, filterTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333', }, optionFilter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center', }, filterOption: { color: '#007AFF', fontWeight: 'bold', }, overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998, }, });

export default SearchInput;