import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React,{useState,useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');

export default function LoginHeading() {
  const { t, i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18nInstance.language);

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

  const handleChangeLanguage = async (value) => {
    setCurrentLanguage(value);
    await AsyncStorage.setItem('selectedLanguage', value);
    i18nInstance.changeLanguage(value);
  };

  return (
    <View style={styles.LoginContainer}>
      <Text style={styles.Logintext}>{t('back')}</Text>
      <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currentLanguage}
            onValueChange={(itemValue) => handleChangeLanguage(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="English" value="En" />
            <Picker.Item label="हिन्दी" value="Hi" />
            <Picker.Item label="मराठी" value="Mr" />
          </Picker>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
    LoginContainer:{
        backgroundColor:'#10b981',
        height:height*0.1,
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal:width*0.05,
        //marginBottom:width*0.15
    },
    Logintext:{
        fontSize:width*0.06,
        fontWeight:'400',
        color:'#ffffff'
    },
    pickerContainer: {
      // marginLeft: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:"#E1F3FD",
      borderRadius:width*0.1,
    },
    picker: {
      color: '#0072B1',
      width: width*0.38,
    },
})