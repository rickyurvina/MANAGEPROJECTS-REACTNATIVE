import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink } from '@apollo/client';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from "@apollo/client/link/context";


const uri = Platform.OS === 'ios' ? 'http://localhost:4000/graphql' : 'http://10.0.2.2:4000/graphql';
const httpLink = new HttpLink({
    uri: uri
  })
const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;