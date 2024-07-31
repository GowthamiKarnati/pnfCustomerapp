import { ScrollView, StyleSheet, Switch, Text, View,Dimensions } from 'react-native';
import React,{useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import Heading from '../components/Heading';
import ProfileForm from '../components/ProfileForm';
import Footer from '../components/Footer';
import ProfileHindi from './ProfileHindi';
import { useNavigation,useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Profile({route}) {
    const {t} =useTranslation();
    const { params = {} } = route; 
    const { mobileNumber,username } = params;
    const [isEnabled, setIsEnabled] = useState(false);
    const [text, setText] = useState('English');
    const navigation = useNavigation();
    // const route = useRoute();
    // console.log("Mobile Number Profile",mobileNumber);

    // useEffect(() => {
    //     if (route.params) {
    //       setIsEnabled(route.params.isEnabled || false);
    //       setText('English');
    //     }
    //   }, [route.params]);

    // const toggleSwitch = () => {
    //     const nextText = isEnabled ?   'Hindi':"English";
    //     setText(nextText);
    //     navigation.navigate('ProfileHindi', { isEnabled: !isEnabled, text: nextText });
    //     setIsEnabled(!isEnabled);
    // };
  return (
    <ScrollView>
      <Heading icon='arrow-left' component='Dash' size={22} text={t('profile')} position={110}/>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:width*0.3}}>
        <Text style={styles.subHeading}>{t('userprofile')}</Text>
        {/* <View style={{display:'flex'}}>
            <Text>{text}</Text>
            <Switch 
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View> */}
      </View>
      <ProfileForm mobileNumber={mobileNumber} />

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