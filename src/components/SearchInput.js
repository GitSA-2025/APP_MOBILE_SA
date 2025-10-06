import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchInput = () => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const toggleFilter = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <Feather name="search" size={20} color="#2B3D52" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar"
                    placeholderTextColor="#2B3D52"
                    underlineColorAndroid="transparent"
                />
                <TouchableOpacity onPress={toggleFilter}>
                    <Feather name="filter" size={20} color="#2B3D52" />
                </TouchableOpacity>
            </View>

            {isFilterVisible && (

                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={toggleFilter}
                >
                    <View style={styles.filterBox}>
                        <Text style={styles.filterTitle}>Filtros</Text>
                        <View style={styles.optionFilter}>
                            <Text>Nome</Text>
                            <TouchableOpacity>
                                <Text style={styles.filterOption}>A-Z</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.optionFilter}>
                            <Text>Data</Text>
                            <TouchableOpacity>
                                <Text style={styles.filterOption}>DECRESCENTE</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.optionFilter}>
                            <Text>Hr. Entrada</Text>
                            <TouchableOpacity>
                                <Text style={styles.filterOption}>DECRESCENTE</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.optionFilter}>
                            <Text>Hr. Saída</Text>
                            <TouchableOpacity>
                                <Text style={styles.filterOption}>DECRESCENTE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        position: 'relative',
    },
    searchBox: {
        backgroundColor: '#fff',
        borderRadius: 4,
        flexDirection: 'row',
        paddingHorizontal: 8,
        alignItems: 'center',
        height: 40,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        marginLeft: 6,
        fontSize: 16,
        color: '#2B3D52',
        flex: 1,
        height: 32,
    },
    filterBox: {
        position: 'absolute',
        top: 45,
        right: 0,
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10,
        zIndex: 200,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    optionFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
    },
    filterOption: {
        color: '#007AFF',
        fontWeight: 'bold',
    },

    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 998,
    },
});

export default SearchInput;
