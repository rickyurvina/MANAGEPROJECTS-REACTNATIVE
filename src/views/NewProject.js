import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useToast, VStack, Button, FormControl, Input, NativeBaseProvider, Center } from 'native-base';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

const NEW_PROJECT = gql`
    mutation newProject($input: ProjectInput){
    newProject(input: $input){
      name
      id
      }
    }
`;

const getProjects = gql`
    query getProjects{
        getProjects{
            id
            name
        }
    }`;


const NewProject = () => {

  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [newProject] = useMutation(NEW_PROJECT,{
    refetchQueries: [{ query: getProjects }]
  });
  const [message, setMessage] = useState(null)
  const toast = useToast();
  const navigation = useNavigation();

  useEffect(() => {
    if (message) {
      showAlert()
      setMessage(null)
    }
  }, [message])


  const onSubmit = async () => {
    if (formData.name === undefined) {
      setErrors({
        ...errors,
        name: 'Name is required'
      });
      return;
    } else if (formData.name.length < 3) {
      setErrors({
        ...errors,
        name: 'Name is too short'
      });
      return;
    }
    try {
      const { data } = await newProject({
        variables: {
          input: {
            name: formData.name
          }
        }
      })
      console.log(data)
      setMessage(data.newProject.name)
      setErrors({});
      navigation.navigate('Projects')

    } catch (error) {
      console.log({ error })
      setMessage(error.message.replace('GraphQL error: ', ''))
    }
  };

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
    <Center flex={1} safeAreaTop>
      <VStack width="100%" pr={5} pl={5}>
        <FormControl isRequired isInvalid={'name' in errors}>
          <FormControl.Label _text={{
            bold: true
          }}>Name</FormControl.Label>
          <Input placeholder="Project Name" onChangeText={value => setData({
            ...formData,
            name: value
          })} />
          {'name' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> :
            null}
        </FormControl>
        <Button onPress={onSubmit} mt="5" colorScheme="cyan">
          Submit
        </Button>
      </VStack>
    </Center>
  )
}

export default NewProject

const styles = StyleSheet.create({})