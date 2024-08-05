import { Button, StyleSheet, Text, View,Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';
import LoginHeading from '../components/LoginHeading'
import LoginForm from '../components/LoginForm'
import Footer from '../components/Footer';

import i18n from '../i18/i18n';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const {t} =useTranslation();
  
  return (
    <ScrollView style={styles.container}>
      <LoginHeading />
      <Text style={styles.subHeading}>{t('login')}</Text>
      <LoginForm />
      <Footer />
    </ScrollView>
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