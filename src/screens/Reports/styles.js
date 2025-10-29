import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
    },
    header: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
        height: 40,
        alignItems: 'center'
    },

    textHeader: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1B202A',
    },

    textInput: {
        backgroundColor: '#f5f6fcff',
        borderRadius: 10,
        padding: 5,
        width: 120,
        borderColor: '#2b3d528a',
        borderWidth: 2,
        fontSize: 18,
        elevation: 5
    },

    btn: {
        backgroundColor: '#963232',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },

    btnText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },

    painelRight: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        flex: 1
    },
    painelLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.3
    },
    secoundContainer: {
        flex: 1,
        flexDirection: 'row',
    },

    textDesc: {
        fontStyle: '600',
        fontSize: 20,
        marginBottom: 20
    },

    labelText:{
        color : '#fff',
        fontWeight: '600',
        fontSize: 20
    },

    labelColabo: {
        backgroundColor: 'rgba(46, 125, 50, 1)',
        padding: 10,
        borderRadius: 6,
        elevation: 5,
        marginBottom: 10,
    },
    labelEntr: {
        backgroundColor: 'rgba(239, 108, 0, 1)',
        padding: 10,
        borderRadius: 6,
        elevation: 5,
        
    },
    labelVisit: {
        backgroundColor: 'rgba(249, 168, 37, 1)',
        padding: 10,
        borderRadius: 6,
        elevation: 5,
        marginBottom: 10,
    },
});

export default styles;