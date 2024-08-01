import { StyleSheet, Text, View,ActivityIndicator ,Dimensions} from 'react-native'
import React,{useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import ItemDetails from './ItemDetails'
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';

const { width, height } = Dimensions.get('window');

export default function ProfileForm({mobileNumber}) {
  // const {t} =useTranslation();
  const { t, i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18nInstance.language);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);
  const [truck,setTruck] = useState([]);
  console.log("Mobile Number Profile",mobileNumber);

  const api="http://10.0.2.2:4000"
  //const api="https://pnf-backend.vercel.app/";

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (storedLanguage) {
          i18nInstance.changeLanguage(storedLanguage);
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading language from AsyncStorage:', error);
      }
    };

    loadLanguage();
  }, []);

  useEffect(()=>{
    fetchProfileData();
    fetchTruckData();
  },[]);
  const fetchProfileData = async ()=>{
    try{
      const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
      // console.log("Mobile number",modifiedMobileNumber);
      let url = `${api}/customer?criteria=sheet_95100183.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
      const res = await axios.get(url);
      // console.log(res.data.data);
      setProfile(res.data.data);
      setLoading(false);
      
    }catch(err){
      console.error('Error fetching data in profile: ',err.message);
    }
  }
  const fetchTruckData = async ()=>{
    try{
      const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
      // console.log("Mobile number",modifiedMobileNumber);
      let url = `${api}/customer/trucks?criteria=sheet_95100183.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
      const res = await axios.get(url);
      console.log(res.data.data);
      setTruck(res.data.data);
      setLoading(false);
    }catch(err){
      console.error('Error fetching data: ',err.message);
    }
  }

  const handleChangeLanguage = async (value) => {
    try {
      setLoading(true); 
      setCurrentLanguage(value);
      await AsyncStorage.setItem('selectedLanguage', value);
      await i18nInstance.changeLanguage(value);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading ?(<ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />):(
    profile.length===0 ? (
      <>
      <View style={styles.box}>
          <Text style={styles.text}>{t('noprofile')}</Text>
      </View>
      </>
    ):(
      <View style={styles.FormContainer}>
          <>
              <ItemDetails text1={t('name')} text2={profile[0]["name"]}/>
              <ItemDetails text1={t('pancard')} text2={profile[0]["pan"]}/>
              <ItemDetails text1={t('dob')} text2={profile[0]["Date of birth"].split(" ")[0]}/>
              <ItemDetails text1={t('mobile')} text2={profile[0]["mobile number"]}/>
              <ItemDetails text1={t('alternatemobile')} text2={profile[0]["alternate mobile number"]}/>
              {/* Trucks Details */}
              <View>
                  <Text style={{ fontSize: width * 0.03, color: '#222222' }}>{t('trucks')}</Text>
                  {truck.map((truck, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={{ fontSize: width * 0.035, color: '#000000' }}>{truck['Truck Number']}</Text>
                    </View>
                  ))}
            </View>
            <ItemDetails text1={t('dealer')} text2={profile[0]["DEALER"]}/>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={currentLanguage}
                onValueChange={(itemValue) => handleChangeLanguage(itemValue)}
                style={styles.picker}
              >
                <Picker.Item style={styles.pickerItem} label="English" value="En" />
                <Picker.Item style={styles.pickerItem} label="हिन्दी" value="Hi" />
                <Picker.Item style={styles.pickerItem} label="मराठी" value="Mr" />
              </Picker>
            </View>
          </>
      </View>
      
      ))}
      {!loading && <Footer />}
    </>
  )
}

const styles = StyleSheet.create({
    FormContainer:{
        backgroundColor:'#ffffff',
        marginHorizontal:width*0.05,
        marginVertical:width*0.03,
        borderRadius:width*0.02,
        padding:width*0.06,
        elevation:width*0.025,
    },
    listItem:{
        flexDirection:'row',
        alignItems:'center',
        overflow:'hidden'
    },
    bullet:{
        fontSize:width*0.05,
        marginRight:width*0.03,
        color:'#000000'
    },
    box:{
      marginVertical:width*0.03,
      marginHorizontal:width*0.038,
      backgroundColor:'#FD3B28',
      padding:width*0.03,
      borderRadius:width*0.018,
      elevation:width*0.015
    },
    text:{
      textAlign:'center',
      fontSize:width*0.04,
      color:"#ffffff"
    },
    pickerContainer: {
      // marginLeft: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:"#E1F3FD",
      borderRadius:width*0.03,
    },
    picker: {
      color: '#0072B1',
      width:width*0.78,
      // backgroundColor:'#C4FAFA'
    },
    pickerItem:{
      // backgroundColor:'#FDFBDD'
    }
})