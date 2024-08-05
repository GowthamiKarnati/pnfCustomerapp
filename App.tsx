/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useEffect,useState} from 'react';
import type {PropsWithChildren} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { AuthProvider,useAuth } from './pages/AuthContext';
import Toast from 'react-native-toast-message';

import {
  StyleSheet,
} from 'react-native';
import Dash from './pages/Dash';
import Login from './pages/Login';
import Travel from './pages/Travel';
import Profile from './pages/Profile';
import MyLoan from './pages/MyLoan';
import MyLoanHindi from './pages/MyLoanHindi';
import StartPage from './pages/StartPage';
import messaging from '@react-native-firebase/messaging';
import EMIDetails from './components/EMIDetails';
import TyreLoan from './components/TyreLoan';
import InsuranceLoan from './components/InsuranceLoan';
import CustomerInfo from './components/CustomerInfo';
import PDFView from './components/PDFView';
import MyTrucks from './pages/MyTrucks';

type SectionProps = PropsWithChildren<{
  title: string;
}>;



function App(): React.JSX.Element {
  const Stack = createStackNavigator();
  const [showStartPage, setShowStartPage] = useState(true);
  const { state } = useAuth();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartPage(false);
    }, 3000);

    // return () => clearTimeout(timer);
  }, []);
  // useEffect(() => {
  //   // Handle foreground notifications
  //   messaging().onMessage(async remoteMessage => {
  //     console.log('Message handled in the foreground!', remoteMessage);
  //     // Display notification or update UI as needed
  //   });
  //   // Set up background message handler
  //   const unsubscribe = messaging().setBackgroundMessageHandler(
  //     async (remoteMessage) => {
  //       console.log('Message handled in the background!', remoteMessage);
  //       // You can handle the message here, e.g., show a local notification
  //     }
  //   );

  //   return unsubscribe;
  // }, []);
  //console.log(state.isAuthenticated);
  

  return (
      <>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={showStartPage ? 'StartPage' : (state.isAuthenticated ? 'Dash1' : 'Login')}>
            {
              showStartPage ? (
                <Stack.Screen name='StartPage' component={StartPage} options={{headerShown:false}} />
              ):(
                state.isAuthenticated ? (
                  <Stack.Screen name='Dash' component={Dash} options={{headerShown:false}} />): 
                  (
                    <Stack.Screen name='Login' component={Login} options={{headerShown:false}} />
                    )
                    )
                  }
            <Stack.Screen name='Travel' component={Travel} options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name='Profile' component={Profile} options={{headerShown:false}} />
            <Stack.Screen name='MyLoan' component={MyLoan} options={{headerShown:false}} />
            <Stack.Screen name='MyLoanHindi' component={MyLoanHindi} options={{headerShown:false}} />
            <Stack.Screen name='TyreLoan' component={TyreLoan} options={{headerShown:false}} />
            <Stack.Screen name='InsuranceLoan' component={InsuranceLoan} options={{headerShown:false}} />
            <Stack.Screen name='PDFView' component={PDFView} options={{headerShown:false}} />
            <Stack.Screen name='MyTrucks' component={MyTrucks} options={{headerShown:false}} />
          </Stack.Navigator>
          <Toast/>
        </NavigationContainer>
        </>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#f3f4f6'
},
});

export default App;
