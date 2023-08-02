import React, { useState } from 'react'
import {
    Input,
    Stack,
    Checkbox,
    Text,
    Box,
    VStack,
    HStack,
    Heading,
    useToast,
} from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useMutation, gql, useQuery } from '@apollo/client';


const NEW_TASK = gql`
        mutation newTask($input: TaskInput){
            newTask(input: $input){
                name
                id
                project
            }
        }
    
`;

const GET_TASKS = gql`
        query getTasks($input: ProjectIdInput){
            getTasks(input: $input){
                id
                name
                state
            }
        }
`;

const DELETE_TASK= gql`
        mutation deleteTask($id: ID!){
            deleteTask(id: $id)
        }
`;

const UPDATE_TASK = gql`
        mutation updateTask($id: ID!, $input: TaskInput, $state: Boolean){
            updateTask(id: $id, input: $input, state: $state){
                name
                id
                project
                state
            }
        }
`;

const Project = ({ route }) => {

    const { name, id, created } = route.params;
    const toast = useToast();
    const [inputValue, setInputValue] = useState("");
    const [newTask] = useMutation(NEW_TASK,{
        refetchQueries: [{ query: GET_TASKS, variables: { input: { project: id } } }]
    });
    const [deleteTask] = useMutation(DELETE_TASK,{
        refetchQueries: [{ query: GET_TASKS, variables: { input: { project: id } } }]
    })
    const [updateTask] = useMutation(UPDATE_TASK)

    const { data, loading, error } = useQuery(GET_TASKS, {
        variables: {
            input: {
                project: id
            }
        }
    });

    if (loading) return <Text>Loading...</Text>
    if (error) return <Text>Loading...</Text>
    const list = data.getTasks.map((task) => {
        return {
            id: task.id,
            name: task.name,
            state: task.state
        }
    })

    const addItem = async (name) => {
        if (name === "") {
            toast.show({
                title: "Please Enter Text",
                status: "warning"
            });
            return;
        }

        try {
            const { data } = await newTask({
                variables: {
                    input: {
                        name: name,
                        project: id
                    }
                }
            })
            console.log("DATA DE BD", data)


        } catch (error) {
            console.log(error.message)
        }

    };

    const handleDelete = async (item) => {
        try{
            const {data}= await deleteTask({
                variables:{
                    id: item.id
                }
            })
            console.log(data)

        }catch(error){
            console.log(error.message)
        }
    
    };

    const handleStatusChange = async (item) => {
        try{
            const {data}= await updateTask({
                variables:{
                    id: item.id,
                    input:{
                        name: item.name
                    },
                    state: !item.state
                }
            })
            console.log(data)

        }catch(error){
            console.log(error.message)
        }
        
    };

    return (
        <>
            <Box mt={3} flex={1}>
                <Box alignItems="center">
                    <Box maxW="90%" w='90%' rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700"
                    }} _web={{
                        shadow: 2,
                        borderWidth: 0
                    }} _light={{
                        backgroundColor: "gray.50"
                    }}>
                        <Stack p="4" space={3}>
                            <Stack space={2}>
                                <Heading size="md" ml="-1">
                                    Project:  {name}
                                </Heading>
                            </Stack>
                            <HStack alignItems="center" space={4} justifyContent="space-between">
                                <HStack alignItems="center">
                                    <Text color="coolGray.600" _dark={{
                                        color: "warmGray.200"
                                    }} fontWeight="400">
                                        {created}
                                    </Text>
                                </HStack>
                            </HStack>
                        </Stack>
                    </Box>
                </Box>
                <Box alignItems="center" mt={4} flex={1}>
                    <Box maxW="90%" w='90%'
                        rounded="lg" overflow="hidden"
                        borderColor="coolGray.200" borderWidth="1"
                        pb={3} pl={3} pr={3} pt={3}>
                        <Heading mb="2" size="md">
                            List of tasks
                        </Heading>
                        <VStack space={4}>
                            <HStack space={2}>
                                <Input flex={1} onChangeText={v => setInputValue(v)} value={inputValue} placeholder="Add Task" />
                                <Icon
                                    name="plus-circle"
                                    size={30} borderRadius="sm"
                                    variant="solid"
                                    style={{ marginTop: 6, marginLeft: 3 }}
                                    onPress={() => {
                                        addItem(inputValue);
                                        setInputValue("");
                                    }}
                                />
                            </HStack>
                            <VStack space={14} >
                                {list.map((item, itemI) =>
                                (<HStack w="100%" justifyContent="space-between" alignItems="center" key={item.name + itemI.toString()}>
                                    <Checkbox
                                        isChecked={item.state}
                                        accessibilityLabel="This is a dummy checkbox" 
                                        onChange={() => handleStatusChange(item)} value={item.name}>

                                    </Checkbox>
                                    <Text width="100%" flexShrink={1} textAlign="left" mx="2" strikeThrough={item.isCompleted} _light={{
                                        color: item.isCompleted ? "gray.400" : "coolGray.800"
                                    }} _dark={{
                                        color: item.isCompleted ? "gray.400" : "coolGray.50"
                                    }} onPress={() => handleStatusChange(itemI)}>
                                        {item.name}
                                    </Text>
                                    <Icon
                                        name="trash"
                                        size={25}
                                        color="red"
                                        onPress={() => handleDelete(item)}
                                    />
                                </HStack>))}
                            </VStack>
                        </VStack>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Project
