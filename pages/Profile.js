import { ScrollView, StyleSheet, Switch, Text, View,Dimensions } from 'react-native';
import React,{useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import Heading from '../components/Heading';
import ProfileForm from '../components/ProfileForm';
import Footer from '../components/Footer';
import { useNavigation,useRoute } from '@react-navigation/native';
import DashHeading from '../components/DashHeading';
const { width } = Dimensions.get('window');

export default function Profile({route}) {
    const {t} =useTranslation();
    const { params = {} } = route; 
    const { mobileNumber} = params;
  return (
    <>
    <DashHeading icon='arrow-left' size={22} component='Dash' text={t('profile')} position={110} mobileNumber={mobileNumber}/>
    {/* <Heading icon='arrow-left' component='Dash' size={22} text={t('profile')} position={110}/> */}
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:width*0.3}}>
          <Text style={styles.subHeading}>{t('userprofile')}</Text>
        </View>
      <ScrollView > 
        <ProfileForm />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
    subHeading:{
      marginHorizontal:width*0.04,
      marginVertical:width*0.02,
      fontSize:width*0.07,
      fontWeight:'600',
      color:'#000000'
    }
})