import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import {
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    Link,
    Button,
    HStack,
    Center,
    useToast,
    Divider
} from "native-base";

import { useNavigation } from '@react-navigation/native';

import globalStyles from '../assets/global';

import { useMutation, gql, useQuery } from '@apollo/client';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTHENTICATE_USER = gql`
    mutation authenticateUser($input: AuthenticInput){
        authenticateUser(input: $input){
        token
        }
    }
`;

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)

    const navigation = useNavigation();

    useEffect(() => {
        if (message) {
            showAlert()
            setMessage(null)
        }
    }, [message])


    const toast = useToast();
    const [authenticateUser] = useMutation(AUTHENTICATE_USER)

    const handleSubmit = async () => {

        if (email === '' || password === '') {
            console.log('All fields are required')
            setMessage('All fields are required')
            return
        }

        if (password.length < 6) {
            setMessage('The password must be at least 6 characters')
            return
        }

        try {
            const { data } = await authenticateUser({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            })
            setMessage("Login successfully")
            const { token } = data.authenticateUser
            if (token) {
                storeData(token)
            }
            navigation.navigate('Projects')
        } catch (error) {
            console.log(error.message)
            setMessage(error.message.replace('GraphQL error: ', ''))
        }
    }

    const showAlert = () => {
        toast.show({
            title: "Alert",
            status: "error",
            description: message,
            duration: 3000,
            placement: 'top'
        })
    }

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('token', value);
        } catch (e) {
            // saving error
            console.log(e)
        }
    };

    return (
        <Center w="100%" style={[globalStyles.container]}>
            <Box safeArea p="2" py="8" w="90%" maxW="290" style={globalStyles.content}>
                <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                    color: "warmGray.50"
                }}>
                    Welcome to UpTask
                </Heading>
                <Heading mt="1" _dark={{
                    color: "warmGray.200"
                }} color="coolGray.600" fontWeight="medium" size="xs">
                    Sign in to continue!
                </Heading>

                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label>Email ID</FormControl.Label>
                        <Input value={email} onChangeText={(email) => setEmail(email.toLowerCase())} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input type="password" secureTextEntry={true}
                            value={password}
                            onChangeText={(password) => setPassword(password)} />
                        <Link _text={{
                            fontSize: "xs",
                            fontWeight: "500",
                            color: "indigo.500"
                        }} alignSelf="flex-end" mt="1">
                            Forget Password?
                        </Link>
                    </FormControl>
                    <Button mt="2" colorScheme="indigo" onPress={() => handleSubmit()}>
                        Sign in
                    </Button>
                    <HStack mt="6" justifyContent="center">
                        <Text fontSize="sm" color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            I'm a new user.{" "}
                        </Text>
                        <Link _text={{
                            color: "indigo.500",
                            fontWeight: "medium",
                            fontSize: "sm"
                        }} onPress={() => navigation.navigate('CreateAccount')}>
                            Sign Up
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </Center>
    )
}

export default Login

const styles = StyleSheet.create({})