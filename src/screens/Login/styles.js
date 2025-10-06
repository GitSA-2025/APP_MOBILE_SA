import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    leftPainel: {
        backgroundColor: '#818C92',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.4
    },
    title: {
        fontSize: 28,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Inter_700Bold',
    },
    subTitle: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
    },
    rightPainel: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        
    },

    titleLogin: {
        fontFamily: 'Inter_400Regular',
        fontSize: 24,
        marginBottom: 40
    },
    linkText: {
        color: '#27445B',
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline',
        fontFamily: 'Roboto_400Regular',
        fontSize: 16
    },
    btnLinkText: {
        alignSelf: 'flex-start'
    },
    btnAvancar: {
        width: '80%',
        backgroundColor: '#8E2927',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center'
    },
    btnText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Inter_700Bold'
    }
});

export default styles;