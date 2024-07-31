import { StyleSheet, Text, View,TextInput,Dimensions } from 'react-native'
// import { View, TextInput, Button } from 'react-native';
import React,{useEffect, useState} from 'react'
import InputDetails from './InputDetails'
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../pages/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const api="http://10.0.2.2:5000"
const { width, height } = Dimensions.get('window');

export default function LoginForm() {
  const {t} =useTranslation();
  const navigation = useNavigation();
  const { dispatch,state,handleLogin } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [cdLoansData, setCdLoansData] = useState([]);
  const [emiData, setEmiData] = useState([]);

  // console.log(state);
  // useEffect(()=>{
  //   fetchCdLoansData();
  //   fetchEmiData();
  // },[cdLoansData,emiData,mobileNumber])

  // const fetchCdLoansData = async ()=>{
  //   // console.log("mobileNumber",mobileNumber)
  //   try{
  //     let url=`${api}/cdloans?criteria=sheet_23049202.column_56.column_87=${mobileNumber}`;
  //     const res = await axios.get(url);
  //     setCdLoansData(res.data.data);
  //     // console.log(res.data.data);
  //   }catch(err){
  //     console.error('Error fetching data: ',err.message);
  //   }
  // }

  // const fetchEmiData = async ()=>{
  //   // console.log("mobileNumber",mobileNumber)
  //   try{
  //     let url=`${api}/emi?criteria=sheet_26521917.column_35.column_87=${mobileNumber}`;
  //     const res = await axios.get(url);
  //     setEmiData(res.data.data);
  //     // console.log(res.data.data);
  //   }catch(err){
  //     console.error('Error fetching data: ',err.message);
  //   }
  // }
 
  const handlePress = async() =>{
    // fetchCdLoansData();
    // fetchEmiData();
    if(mobileNumber.length === 10){
      try{
        // Simulate a successful login
        const mockResponse = { data: { token: 'mockToken' } };

        // Uncomment this line to simulate an error during login
        // throw new Error('Simulated login error');

        // Simulate a delay to mimic a network request
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use the mock response for the token
        const { token } = mockResponse.data;
        // Save the token and update authentication state
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('mobileNumber', mobileNumber);
        handleLogin(token,mobileNumber);
        // navigation.navigate('Dash');
        // Update login form fields in the state
        dispatch({
          type: 'SET_STATE',
          payload: {
            loginForm: {
              mobileNumber
            },
          },
        });
        dispatch({ type: 'LOGIN' });
        navigation.navigate('Dash');
      }catch(err){
        console.error('Error during login:', err);
      }
    }else if(mobileNumber>10 || mobileNumber<10){
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: t('toastloginerrmessage1'),
        text2: t('toastloginerrmessage2'),
        visibilityTime: 3000, // 3 seconds duration
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }
    else{
      navigation.navigate('Login')
    }
    // console.log(mobileNumber);
  }

  return (
    <View style={styles.FormContainer}>
      <InputDetails 
        head={t('mobile')}
        placeholder={t('mobilePlace')}
        placeholderTextColor='#888888'
        value={mobileNumber} 
        onChangeText={(e)=>setMobileNumber(e)}
      />
      <InputDetails 
          head={t('otp')}
          placeholder={t('otpPlace')}
          placeholderTextColor='#888888' 
      />
      <Button text={t('login')} width={width*0.28} onPress={handlePress} />
    </View>
  )
}

const styles = StyleSheet.create({
    FormContainer:{
        backgroundColor:'#ffffff',
        marginHorizontal:width*0.05,
        borderRadius:width*0.03,
        padding:width*0.05,
        elevation:width*0.028,
    },
})