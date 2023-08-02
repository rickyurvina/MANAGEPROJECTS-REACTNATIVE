
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/views/Login';
import CreateAccount from './src/views/CreateAccount';
import type { StorageManager } from "native-base";
import { extendTheme, NativeBaseProvider, ColorMode } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Projects from './src/views/Projects';
import NewProject from './src/views/NewProject';
import Project from './src/views/Project';


function App(): JSX.Element {

  const Stack = createNativeStackNavigator();

  const newColorTheme = {
    brand: {
      900: "#8287af",
      800: "#7c83db",
      700: "#b3bef6",
    },
  };


  const theme = extendTheme({ colors: newColorTheme });

  const colorModeManager: StorageManager = {
    get: async () => {
      try {
        let val = await AsyncStorage.getItem("@my-app-color-mode");
        return val === "dark" ? "dark" : "light";
      } catch (e) {
        console.log(e);
        return "light";
      }
    },
    set: async (value: ColorMode) => {
      try {
        await AsyncStorage.setItem("@my-app-color-mode", value);
      } catch (e) {
        console.log(e);
      }
    },
  };

  return (
    <>
      <NativeBaseProvider theme={theme}
        colorModeManager={colorModeManager}
      >
        <NavigationContainer>
          <Stack.Navigator>
            {/* <Stack.Screen
              name="Login"
              component={Login}
              options={{
                title: 'Login',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccount}
              options={{
                title: 'Create Account',
                headerShown: false,
              }}
            /> */}
            <Stack.Screen
              name="Projects"
              component={Projects}
              options={{
                title: 'Projects',
              }}
            />
            <Stack.Screen
              name="NewProject"
              component={NewProject}
              options={{
                title: 'NewProject',
              }}
            />

            <Stack.Screen
              name="Project"
              component={Project}
              options={({route})=>({
                  title: route.params.name,
                
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </>
  );
}



export default App;
