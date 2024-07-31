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


const { width, height } = Dimensions.get('window');

export default function Travel() {
  const {t} =useTranslation();
  // const { params = {} } = route; 
  // const { mobileNumber } = params;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);
  const [username, setUsername] = useState('');
  const [mobilenumber2,setMobileNumber]=useState('');
  const { state } = useAuth();

  const mobileNumber = state.loginForm.mobileNumber;
  console.log("Travel",mobileNumber);
  
  const api="https://pnf-backend.vercel.app/";

    console.log("Customer Info",mobileNumber);
    useEffect(()=>{
        fetchProfileData();
    },[mobileNumber]);

    const fetchProfileData = async ()=>{
        try{
          const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
          // console.log("Mobile number",modifiedMobileNumber);
          let url = `${api}/customer?criteria=sheet_95100183.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
          const res = await axios.get(url);
        //   console.log(res.data.data);
          setProfile(res.data.data);
          const name = res.data.data[0]["name"];
          const mobileNumber1 = res.data.data[0]["mobile number"]
          setUsername(name);
          setMobileNumber(mobileNumber1);
          setLoading(false);
          
        }catch(err){
          console.error('Error fetching data: ',err.message);
        }
      }

  console.log(mobileNumber);
  return (
    
    <ScrollView>
      <Heading icon='arrow-left' component='Dash' size={22} text={t('customerDetails')} position={110}/>
      {loading?(
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
        ):(
      <CustomerInfo mobileNumber={mobileNumber} username={username} mobilenumber2={mobilenumber2} />
        )}
      {/* <LoanDetail mobileNumber={mobileNumber} /> */}
    </ScrollView>
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