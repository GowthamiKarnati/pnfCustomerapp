import { StyleSheet, Text, View,ActivityIndicator,Dimensions } from 'react-native'
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import Heading from '../components/Heading';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../pages/AuthContext';
import TruckList from '../components/TruckList';
import Footer from '../components/Footer';

const { width, height } = Dimensions.get('window');

export default function MyTrucks() {
    const {t} =useTranslation();
    const { state, handleLogout } = useAuth();
    const mobileNumber = state?.loginForm?.mobileNumber;
    console.log("my truck",mobileNumber);
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(true);

    const api="https://pnf-backend.vercel.app/";

    useEffect(()=>{
        fetchVehicleData()
    },[mobileNumber]);

    const fetchVehicleData = async ()=>{
        try{
          const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
          // console.log("Mobile number",modifiedMobileNumber);
          let url = `${api}/vehicles?criteria=sheet_32026511.column_609.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
          const res = await axios.get(url);
        //   console.log(res.data.data);
          setVehicleData(res.data.data);
          setLoading(false);
        }catch(err){
          console.error('Error fetching data: ',err.message);
        }
      }

  return (
    <ScrollView>
      <Heading icon='arrow-left' component='Dash' size={22} text={t('mytruck')} position={110}/>
      <Text style={styles.subHeading}>{t('mytrucklist')}</Text>
      {/* <Text>My Trucks</Text> */}
      {loading?(
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
      ):(
        <>
          <TruckList vehicleData={vehicleData} />
          {/* <Footer /> */}
        </>
      )}
    </ScrollView>
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