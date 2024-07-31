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
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

export default function Dash({route}) {
  const {t} =useTranslation();
  const [emiData, setEmiData] = useState([]);
  const { state, handleLogout } = useAuth();
  const [profile, setProfile] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [loanid,setloanId]=useState('');
  // const { mobileNumber } = route.params;
  const mobileNumber = state?.loginForm?.mobileNumber;
  // console.log("mobileNumber Dash",mobileNumber);
  const navigation = useNavigation();

  // const api="http://10.0.2.2:5000";
  const api="https://pnf-backend.vercel.app/";

  useEffect(() => {
    // Check the authentication state before rendering the component
    if (!state.isAuthenticated) {
      // Navigate to the 'Login' screen if the user is not authenticated
      navigation.replace('Login');
      // fetchProfileData();
    }
    else{
      fetchProfileData();
      getToken();
    }
  }, [state.isAuthenticated, navigation]);

  const fetchProfileData = async ()=>{
    try{
      const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
      // console.log("Mobile number",modifiedMobileNumber);
      let url = `${api}/customer?criteria=sheet_95100183.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
      const res = await axios.get(url);
      // console.log(res.data.data);
      setProfile(res.data.data);
      const name = res.data.data[0]["name"];
      setUsername(name);
      setLoading(false);
    }catch(err){
      console.error('Error fetching data: ',err.message);
    }
  }

  const getToken=async()=>{
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      const mobileNumber = state.loginForm.mobileNumber;
      firestore().collection('customer').doc(mobileNumber).set({
        token: token
      })
      .then(() => {
        console.log('Token added for mobile number: ', mobileNumber);
      })
      .catch(error => {
        console.error('Error adding token: ', error);
      });
    }
    // const mobileNumber = state?.loginForm?.mobileNumber;
    // console.log({token,mobileNumber});
    // console.log("App",mobileNumber);
    // if (mobileNumber) {
    //   await sendTokenToBackend(token, mobileNumber);
    // }
    // Send the token to the backend
    // await sendDataToBackend(token);    
  }

  useEffect(() => {
    // Handle foreground notifications
    messaging().onMessage(async remoteMessage => {
      console.log('Message handled in the foreground!', remoteMessage);
      // Display notification or update UI as needed
      Toast.show({
        type: 'info',
        position: 'top',
        text1: remoteMessage.notification.title,
        text2: remoteMessage.notification.body,
        visibilityTime: 10000, // 10 seconds duration
        autoHide: true,
        topOffset: 40,
        bottomOffset: 40,
      });
    });
    // Set up background message handler
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
        console.log('Loan Id',remoteMessage.data.screen);
        const loanid=remoteMessage.data.screen;
        setloanId(loanid);
        if(remoteMessage.data.screen){
          // navigation.navigate('EMIDetails',{mobileNumber,loanid});
          navigation.navigate('MyLoan',{mobileNumber,loanid});
        }
        // You can handle the message here, e.g., show a local notification
      }
    );
    return unsubscribe;
  }, []);

  const capitalize = (str) => {
    if (!str) return ''; // Handle cases where str is undefined or null
    return str
      .split(' ') // Split the string into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join the words back into a string
  };
  
  // console.log(cdLoansData);
  // console.log(mobileNumber);
  // console.log(emiData);
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
      color:'#474747'
    }
})