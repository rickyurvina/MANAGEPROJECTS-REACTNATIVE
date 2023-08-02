import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import {
    useToast,
    Button,
    Box,
    Text,
    Pressable,
    Heading,
    IconButton,
    Icon,
    HStack,
    Avatar,
    VStack,
    Spacer,
    Center,
    ScrollView,
    Divider
} from 'native-base';

const getProjects = gql`
    query getProjects{
        getProjects{
            id
            name
            created
        }
    }`;


const Projects = () => {

    const navigation = useNavigation();
    const { data, loading, error } = useQuery(getProjects)
    if (loading) return <Text>Loading...</Text>
    if (error) return <Text>Error</Text>
    console.log(data)
    const listProjects = data.getProjects.map((project) => {
        return {
            id: project.id,
            name: project.name,
            created: project.created
        }
    })

    const renderItem = ({
        item,
        index
    }) =>
        <>
            <Box>
                <Pressable onPress={() => navigation.navigate("Project", item)} _dark={{
                    bg: 'coolGray.800'
                }} _light={{
                    bg: 'white'
                }}>
                    <Box pl="4" pr="5" py="2">
                        <HStack alignItems="center" space={3}>

                            <VStack>
                                <Text color="coolGray.800" _dark={{
                                    color: 'warmGray.50'
                                }} bold>
                                    {item.name}
                                </Text>
                                <Text color="coolGray.600" _dark={{
                                    color: 'warmGray.200'
                                }}>
                                    {/* {item.recentText} */}
                                </Text>
                            </VStack>
                            <Spacer />

                        </HStack>
                    </Box>
                </Pressable>
            </Box>
            <Divider />
        </>
        ;

    const renderHiddenItem = (data, rowMap) => <HStack flex={1}>
        <Pressable w="70" ml="auto" cursor="pointer" bg="coolGray.200" justifyContent="center"
            onPress={() => navigation.navigate("Project", data.item)} _pressed={{
                opacity: 0.5
            }}>
            <VStack alignItems="center" space={2}>
                {/* <Icon as={<Entypo name="dots-three-horizontal" />} size="xs" color="coolGray.800" /> */}
                <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                    More
                </Text>
            </VStack>
        </Pressable>
        <Pressable w="70" cursor="pointer" bg="red.500" justifyContent="center" onPress={() => console.log("delete row")} _pressed={{
            opacity: 0.5
        }}>
            <VStack alignItems="center" space={2}>
                {/* <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" /> */}
                <Text color="white" fontSize="xs" fontWeight="medium">
                    Delete
                </Text>
            </VStack>
        </Pressable>
    </HStack>;

    return (
        <Center w="100%" flex={1}>
            <Box maxW="90%" w="100%" mt={3} flex={1}>
                <VStack space={4}>
                    <VStack space={2}>
                        <Button onPress={() => navigation.navigate('NewProject')}>
                            <Text>
                                New Project
                            </Text>
                        </Button>
                    </VStack>
                </VStack>
                <Box mt={4}>
                    <SwipeListView
                        data={listProjects}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-130}
                        previewRowKey={'0'}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                    />
                </Box>

            </Box>
        </Center>
    )
}

export default Projects
