import { StyleSheet, Text, View,Dimensions,ActivityIndicator, ScrollView } from 'react-native'
import React,{useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Heading from '../components/Heading';
import TravelForm from '../components/TravelForm'
import Footer from '../components/Footer';
import CustomerInfo from '../components/CustomerInfo';
import LoanDetail from '../components/LoanDetail';
import { useAuth } from '../pages/AuthContext';
import DashHeading from '../components/DashHeading';

const { width, height } = Dimensions.get('window');

export default function Travel() {
  const {t} =useTranslation();
  const { state } = useAuth()
  const mobileNumber = state.loginForm.mobileNumber;
  const profile = state.profile;
  const mobilenumber2 = profile[0]["mobile number"];
  const username = profile[0].name
  //console.log("nsbdvfyu", username)
  const api="https://pnf-backend.vercel.app/";
  return (
    
    <ScrollView>
      <DashHeading icon='arrow-left' size={22} component='Dash' text={t('customerDetails')} position={110} mobileNumber={mobileNumber}/>
      {/* <Heading icon='arrow-left' component='Dash' size={22} text={t('customerDetails')} position={110}/> */}
      <CustomerInfo mobileNumber={mobileNumber} username={username} mobilenumber2={mobilenumber2} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    subHeading:{
        marginHorizontal:width*0.05,
        marginVertical:height*0.03,
        fontSize:width*0.06,
        fontWeight:'500',
        color:'#000000',
        display:'flex',
        justifyContent:'center'
    }
})