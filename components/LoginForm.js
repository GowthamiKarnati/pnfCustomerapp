import { StyleSheet, View, Dimensions, Alert } from 'react-native'
import React,{useState} from 'react'
import InputDetails from './InputDetails'
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../pages/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShowToast from './ShowToast';

const api="http://10.0.2.2:4000"
const { width, height } = Dimensions.get('window');



export default function LoginForm() {
  const {t} =useTranslation();
  const navigation = useNavigation();
  const { dispatch,state,handleLogin } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if(mobileNumber === ''){
      Alert.alert("Please enter the mobile number");
      return;
    }
    setLoading(true);
      try {
        const verifiedValue = encodeURIComponent(mobileNumber);
        // Make the request to validate the mobile number
        const response = await axios.post(`${api}/customer/validate?verifyValue=${verifiedValue}`);
        if (response.status === 200) {
          // Simulate a successful login
          const mockResponse = { data: { token: 'mockToken' } };
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const { token } = mockResponse.data;
          await AsyncStorage.setItem('authToken', token);
          await AsyncStorage.setItem('mobileNumber', mobileNumber);
          await handleLogin(token, mobileNumber);
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
        } else {
          ShowToast('error', 'Invalid Mobile Number', 'Please check the mobile number and try again.');
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            ShowToast('error', "Not Found", "The mobile number was not found")
          } else if (err.response.status === 403) {
            ShowToast('error', 'Forbidden', 'You do not have permission to access this resource')
          } else {
            ShowToast('error', 'Request Error', 'An error occured while making the request. Please try again')
          }
        } else {
          ShowToast('error', 'Network Error', 'An error occurred while trying to connect. Please check your network and try again')
        }
        //console.error('Error during login:', err);
      }
      finally{
        setLoading(false);
      }
  };
  

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
      <Button text={t('login')} width={width*0.28} onPress={handlePress} loading={loading}/>
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