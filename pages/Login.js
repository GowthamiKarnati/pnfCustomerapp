import { Button, StyleSheet, Text, View,Dimensions } from 'react-native'
import React,{useState,useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginHeading from '../components/LoginHeading'
import LoginForm from '../components/LoginForm'
import Footer from '../components/Footer';

import i18n from '../i18/i18n';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const {t} =useTranslation();
  
  return (
    <View style={styles.container}>
      <LoginHeading />
      <Text style={styles.subHeading}>{t('login')}</Text>
      <LoginForm />
      <Footer />
      {/* <View style={styles.languageSelector}>
      <Button onPress={() => changeLanguage('En')} title="English" disabled={currentLanguage === 'En'} />
        <Button onPress={() => changeLanguage('Hi')} title="हिन्दी" disabled={currentLanguage === 'Hi'} />
        <Button onPress={() => changeLanguage('Mr')} title="मराठी" disabled={currentLanguage === 'Mr'} />
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
    subHeading:{
        marginHorizontal:width*0.06,
        marginVertical:width*0.05,
        fontSize:width*0.08,
        fontWeight:'600',
        color:'#000000'
    },
    languageSelector: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 20,
    },
})