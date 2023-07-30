import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: '2.5%',
        flex: 1,
    },
    title:{
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF'
    },
    input:{
        backgroundColor: '#FFF',
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 18,
        borderRadius: 10

    },
    button:{
        backgroundColor: '#28303B',
        padding: 10,
        borderRadius: 10,
        height: 50,
        justifyContent: 'center'
    }
});

export default globalStyles;