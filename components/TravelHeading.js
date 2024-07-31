import { StyleSheet, Text, TouchableOpacity, View,Dimensions } from 'react-native'
import React from 'react';
import { useTranslation } from 'react-i18next';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../pages/AuthContext';

const { width, height } = Dimensions.get('window');

export default function TravelHeading({component}) {
  const {t} =useTranslation();
  const { dispatch,state,handleLogout,resetLoginData } = useAuth();
  const navigation = useNavigation();
  const mobileNumber = state.loginForm.mobileNumber;
  console.log("Travel Heading",mobileNumber);
    const handleProfilePress = () => {
        navigation.navigate(component,{mobileNumber}); 
    };
    const handleLogoutButton = async() => {
      // Dispatch an action to update the authentication state
      // console.log('Before logout dispatch:', state);
      await handleLogout(mobileNumber);
      await resetLoginData();
      // console.log('After logout dispatch:', state);
      // Update login form fields in the state to clear the data
      navigation.navigate('Login');
  }
  return (
    <View style={styles.travelContainer}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity onPress={handleProfilePress}>
            <Icon name='arrow-left'  size={20} color='#ffffff' />
          </TouchableOpacity>
          <Text style={styles.travelText}>{t('back')}</Text>
      </View>
      <TouchableOpacity onPress={handleLogoutButton}>
          <Icon name="sign-out" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    travelContainer:{
        backgroundColor:'#10b981',
        height:height*0.1,
        display:'flex',
        paddingHorizontal:width*0.05,
        marginBottom:width*0.06,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    travelText:{
        fontSize:width*0.05,
        fontWeight:'400',
        color:'#ffffff',
        paddingLeft:width*0.02,
        // marginRight:260
    }
})