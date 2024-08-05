import { StyleSheet, Text, View,Dimensions, TouchableOpacity,ActivityIndicator, ScrollView } from 'react-native'
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native'; 
import { useTranslation } from 'react-i18next';
import CustomAlert from './CustomAlert';

const { width, height } = Dimensions.get('window');

export default function CustomerInfo({mobileNumber,username,mobilenumber2}) {
    const {t} =useTranslation();
    const [loading, setLoading] = useState(false);
    const [vehicleData, setVehicleData] = useState(null);
    const navigation = useNavigation();
    const [customerDetails, setCustomerDetails] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert1, setShowAlert1] = useState(false);
    const api="https://pnf-backend.vercel.app/";

    useEffect(()=>{
        fetchVehicleData();
        fetchCustomerKYCData();
    },[mobileNumber]);

    const fetchVehicleData = async ()=>{
      try{
        setLoading(true)
        const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
        let url = `${api}/vehicles?criteria=sheet_32026511.column_609.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
        const res = await axios.get(url);
        setVehicleData(res.data.data); 
        setLoading(false);
      }catch(err){
        console.error('Error fetching data in customer: ',err.message);
      }
    }
    const fetchCustomerKYCData = async ()=>{
      try{
        setLoading(true);
        const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
        let url = `${api}/customerKyc?criteria=sheet_42284627.column_1100.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
        const res = await axios.get(url);
        setCustomerDetails(res.data.data[0]);
        setLoading(false);
      }catch(err){
        console.error('Error fetching data in customer: ',err.message);
      }
    }
    const capitalize = (str) => {
      if (!str) return ''; // Handle cases where str is undefined or null
      return str
        .split(' ') // Split the string into an array of words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join(' '); // Join the words back into a string
    };
    const handletryeloan = ()=>{
      if (!customerDetails) {
          setShowAlert(true);
          return;
        }else if(customerDetails['KYC Status']==='Inactive'){
          setShowAlert1(true);
          return;
        }else{
          navigation.navigate('TyreLoan',{mobileNumber,vehicleData,customerDetails});
        }
    }
    const handleinsuranceloan = ()=>{
      if (!customerDetails) {
          setShowAlert(true);
          return;
        }else if(customerDetails['KYC Status']==='Inactive'){
          setShowAlert1(true);
          return;
        }else{
          navigation.navigate('InsuranceLoan',{mobileNumber,vehicleData,customerDetails});
        }
    }

  return (
    <>
    {loading?(
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
        ):(
            <ScrollView style={styles.FormContainer}>
                <Text style={styles.username}>{capitalize(username)}</Text>
                <View style={styles.mobileContainer}>
                    <Text style={styles.mobileText}>{mobilenumber2}</Text>
                    <Icon style={styles.Itemicon1} name='phone' size={20} color="#1EE050" />
                </View>
                <View style={styles.form}>
                    <TouchableOpacity style={styles.loanContainer1} onPress={handletryeloan}>
                        <Icon style={styles.Itemicon} name='truck' size={20} color="#F9EA57" />
                        <Text style={styles.loantext}>{t("tyreloan")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loanContainer2} onPress={handleinsuranceloan}>
                        <Icon style={styles.Itemicon} name='shield-halved' size={20} color="#F9EA57" />
                        <Text style={styles.loantext}>{t("insuranceloan")}</Text>
                    </TouchableOpacity>
                </View>
                <CustomAlert
                    isVisible={showAlert}
                    message1={t('customerkycmissing')}
                    message2={t('customerkycmissingdesc')}
                    onClose={() => setShowAlert(false)}
                />
                <CustomAlert
                    isVisible={showAlert1}
                    message1={t('customerkycinactive')}
                    message2={t('customerkycinactivedesc')}
                    onClose={() => setShowAlert1(false)}
                />
            </ScrollView>
        )}
    </>
  )
}

const styles = StyleSheet.create({
    FormContainer:{
        backgroundColor:'#ffffff',
        marginHorizontal:width*0.03,
        marginVertical:width*0.01,
        paddingVertical:width*0.02,
        borderRadius:width*0.028,
        paddingHorizontal:width*0.04,
        elevation:width*0.02,
    },
    username:{
        fontSize:width*0.064,
        fontWeight:'500',
        color:'#444444',
        marginVertical:width*0.015
    },
    mobileContainer:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:width*0.03
    },
    mobileText:{
        fontSize:width*0.05,
        fontWeight:'600',
        marginBottom:width*0.01,
        marginRight:width*0.02
    },
    form:{
        flexDirection:'row',
        // justifyContent:'space-between',
        // marginHorizontal:width*0.03,
        // paddingHorizontal:width*0.03,
        marginBottom:width*0.06
    },
    loanContainer1:{
        flexDirection:'row',
        backgroundColor:'#0C82DE',
        paddingVertical:width*0.04,
        paddingHorizontal:width*0.032,
        borderRadius:width*0.02,
        marginRight:width*0.02,
        // width:width*0.4,
        justifyContent:'center',
        alignItems:'center',
        width:width*0.36
    },
    loanContainer2:{
      flexDirection:'row',
      backgroundColor:'#0C82DE',
      paddingVertical:width*0.04,
      paddingHorizontal:width*0.032,
      borderRadius:width*0.02,
      marginLeft:width*0.02,
      // width:width*0.4,
      justifyContent:'center',
      alignItems:'center',
      width:width*0.44
  },
    loantext:{
        color:'#eeeeee',
        fontSize:width*0.045,
        fontWeight:"600",
        marginLeft:width*0.02,
        textAlign:'center'
    },
    Itemicon1:{
      transform: [{ rotate: '250deg' }],
    }
})