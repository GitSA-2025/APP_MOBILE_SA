import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#818C92',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    painel: {
        width: width > 800 ? width * 0.8 : width * 0.95,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 4
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10
    },
    fullPainel: {
        flexDirection: width > 800 ? 'row' : 'column',
        justifyContent: 'space-between',
    },
    painelLeft: {
        width: width > 800 ? '65%' : '100%',
        paddingRight: width > 800 ? 20 : 0
    },
    painelRight: {
        width: width > 800 ? '30%' : '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: width > 800 ? 0 : 20
    },
    photo: {
        width: 150,
        height: 150,
        borderRadius: 12,
        backgroundColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    photoText: {
        fontSize: 12,
        color: '#333',
        marginBottom: 20
    },
    btnSalvar: {
        backgroundColor: '#8E2927',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default styles;
