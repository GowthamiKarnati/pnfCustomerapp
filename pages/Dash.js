import { ScrollView, StyleSheet, Text, View, useWindowDimensions,Dimensions,ActivityIndicator } from 'react-native'
import React,{useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import Heading from '../components/Heading'
import ItemList from '../components/ItemList'
import LoanDetail from '../components/LoanDetail'
import Footer from '../components/Footer';
import axios from 'axios'
import { useAuth } from '../pages/AuthContext';
import DashHeading from '../components/DashHeading'
import { useNavigation } from '@react-navigation/native'; 
import messaging from '@react-native-firebase/messaging';
import ShowToast from '../components/ShowToast'

const { width } = Dimensions.get('window');

export default function Dash() {
  const {t} =useTranslation();
  const { state, setProfileData } = useAuth();
  const [profile, setProfile] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [loanid,setloanId]=useState('');
  const mobileNumber = state?.loginForm?.mobileNumber;
  const navigation = useNavigation();

  // const api="http://10.0.2.2:5000";
  const api="https://pnf-backend.vercel.app/";

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigation.replace('Login');
    }
    else{
      if (state.profile.length === 0) { 
        fetchProfileData();
      } else {
        setUsername(state.profile[0]?.name || "No name available");
        setLoading(false);
      }
    }
  }, [state.isAuthenticated, navigation]);

  const fetchProfileData = async () => {
    try {
      console.log("Api is calling")
      const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10) : mobileNumber;
      let url = `${api}/customer?criteria=sheet_95100183.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
      
      const res = await axios.get(url);
      //console.log("API Response:", res.data);
      
      const profileData = res.data.data;
      setProfile(profileData);
      setProfileData(profileData)
      if (Array.isArray(profileData) && profileData.length > 0) {
        const name = profileData[0]?.name || "No name available";
        setUsername(name);
      } else {
        setUsername("No profile data");
      }
  
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data in Dash:', err.message);
    }
  };
  

  useEffect(() => {
    // Handle foreground notifications
    messaging().onMessage(async remoteMessage => {
      console.log('Message handled in the foreground!', remoteMessage);
      ShowToast('info', remoteMessage.notification.title, remoteMessage.notification.body);
    });
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
        //console.log('Loan Id',remoteMessage.data.screen);
        const loanid=remoteMessage.data.screen;
        setloanId(loanid);
        if(remoteMessage.data.screen){
          navigation.navigate('MyLoan',{mobileNumber,loanid});
        }
      }
    );
    return unsubscribe;
  }, []);

  const capitalize = (str) => {
    if (!str) return ''; 
    return str
      .split(' ') 
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' ');
  };
  
  return (
    <>
    <DashHeading icon='user-circle' size={28} component='Profile' text={t('pnf')} position={80} mobileNumber={mobileNumber} />
    {loading?(
      <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
    ):(
      <ScrollView>
        <Text style={styles.welcometext}>{t('welcome')}, {capitalize(username)} </Text>
        <ItemList icon="file-alt" component='Travel' text={t('applyloan')} color="#3B82F6" />
        <ItemList icon="truck" component='MyTrucks' text={t('mytruck')} color="#10b981" mobileNumber={mobileNumber} />
        <ItemList icon="money-check-dollar" component='MyLoan' text={t("myloan")} color="#F59E0B" mobileNumber={mobileNumber} />
        <ItemList icon="shield-halved" component='Dash' text={t("insurance")} color="#6366F1" mobileNumber={mobileNumber} />
        <LoanDetail mobileNumber={mobileNumber} />  
        {/* <LoanDetail loanid="789012" amount1="8,000" amount2="15,000" date1="2023-11-01" date2="2023-11-15" stat1="Paid" stat2="Unpaid" mobileNumber={mobileNumber}/> */}
        <Footer />
      </ScrollView>
    )}
  </>
  )
}

const styles = StyleSheet.create({
    welcometext:{
      marginLeft:width*0.06,
      fontSize:width*0.07,
      fontWeight:'500',
      color:'#474747',
    }
})