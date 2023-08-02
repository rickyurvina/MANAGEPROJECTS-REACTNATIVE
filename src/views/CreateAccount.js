import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useToast, Box, Heading, Link, VStack, HStack, Text, FormControl, Input, Button, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../assets/global';

import { useMutation, gql, useQuery } from '@apollo/client';

const NEW_ACCOUNT = gql`
    mutation createUser($input: UserInput){
        createUser(input: $input)
    }
`;

const CreateAccount = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState(null)

    const navigation = useNavigation();
    const toast = useToast();
    const [createUser] = useMutation(NEW_ACCOUNT)

    useEffect(() => {
        if (message) {
            showAlert()
            setMessage(null)
        }
    }, [message])

    const handleSubmit = async () => {

        if (email === '' || password === '' || name === '') {
            console.log('All fields are required')
            setMessage('All fields are required')
            return
        }

        if (password.length < 6) {
            setMessage('The password must be at least 6 characters')
            return
        }

        try {
            const { data } = await createUser({
                variables: {
                    input: {
                        name,
                        email,
                        password
                    }
                }
            })
            console.log(data)
            setMessage(data.createUser)
            navigation.navigate('Login')

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


    return (
        <Center w="100%" style={globalStyles.container}>
            <Box safeArea p="2" w="90%" maxW="290" py="8" style={globalStyles.content}>
                <Heading size="lg" color="coolGray.800" _dark={{
                    color: "warmGray.50"
                }} fontWeight="semibold">
                    Welcome
                </Heading>
                <Heading mt="1" color="coolGray.600" _dark={{
                    color: "warmGray.200"
                }} fontWeight="medium" size="xs">
                    Sign up to continue!
                </Heading>
                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label>Name</FormControl.Label>
                        <Input value={name} onChangeText={(name) => setName(name)} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input value={email} onChangeText={(email) => setEmail(email)} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input type="password" value={password} onChangeText={(password) => setPassword(password)} />
                    </FormControl>
                    <Button mt="2" colorScheme="indigo" onPress={() => handleSubmit()}>
                        Sign up
                    </Button>
                </VStack>
                <HStack mt="6" justifyContent="center">
                    <Text fontSize="sm" color="coolGray.600" _dark={{
                        color: "warmGray.200"
                    }}>
                        I have an account
                    </Text>
                    <Link _text={{
                        color: "indigo.500",
                        fontWeight: "medium",
                        fontSize: "sm"
                    }} onPress={() => navigation.navigate('Login')}>
                        Login
                    </Link>
                </HStack>
            </Box>

        </Center>
    )
}

export default CreateAccount

const styles = StyleSheet.create({})