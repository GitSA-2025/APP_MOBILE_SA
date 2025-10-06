import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Inter_700Bold, Inter_300Light, Inter_400Regular, Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Roboto_300Light, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { useEffect } from 'react';


import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import EntryRegister from './src/screens/EntryRegister';
import DeliveryRegisterScreen from './src/screens/DeliveryRegisterScreen';
import DeliveryRegister from './src/screens/DeliveryRegister';
//import QrCodeApproval from './src/screens/QrCodeApproval';
import TwoFA from './src/screens/twoFA';
import EditEntryRegister from './src/screens/EditEntryRegister';
import EditDeliveryRegister from './src/screens/EditDeliveryRegister';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function App() {

  const [loaded, error] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
    Inter_400Regular,
    Inter_300Light,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="EntryRegister" component={EntryRegister} options={{ headerShown: false }} />
        <Stack.Screen name="DeliveryRegisterScreen" component={DeliveryRegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DeliveryRegister" component={DeliveryRegister} options={{ headerShown: false }} />
        <Stack.Screen name="TwoFA" component={TwoFA} options={{ headerShown: false }} />
        <Stack.Screen name="EditEntryRegister" component={EditEntryRegister} options={{ headerShown: false }} />
        <Stack.Screen name="EditDeliveryRegister" component={EditDeliveryRegister} options={{ headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;