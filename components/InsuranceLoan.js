import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';
import TravelHeading from '../components/TravelHeading'
import InsuranceForm from './InsuranceForm';
import Footer from '../components/Footer';

const { width, height } = Dimensions.get('window');

export default function InsuranceLoan({route}) {
    const {t} =useTranslation();
    const { params = {} } = route; 
    const { mobileNumber,vehicleData,customerDetails } = params;
  return (
    <View>
      <TravelHeading component='Travel' />
      <Text style={styles.subHeading}>{t('applyinsuranceloan')}</Text>
      <InsuranceForm mobileNumber={mobileNumber} vehicleData={vehicleData} customerDetails={customerDetails} />
    </View>
  )
}

const styles = StyleSheet.create({
    subHeading:{
        marginHorizontal:width*0.05,
        marginVertical:width*0.03,
        fontSize:width*0.06,
        fontWeight:'500',
        color:'#000000',
        display:'flex',
        justifyContent:'center'
    }
})