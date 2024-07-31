import { StyleSheet, Text, View,Switch, ScrollView } from 'react-native';
import React,{useState} from 'react';
import Heading from '../components/Heading';
import ProfileHindiForm from '../components/ProfileHindiForm';
import FooterHindi from '../components/FooterHindi';
import { useNavigation,useRoute } from '@react-navigation/native';

export default function ProfileHindi() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [text, setText] = useState('Hindi');
  const navigation = useNavigation();
  const route = useRoute();

  const toggleSwitch = () => {
    const nextText = isEnabled ? 'Hindi' : 'English';
    setText(nextText);
    navigation.navigate('Profile', {isEnabled: !isEnabled, text: nextText });
    setIsEnabled(!isEnabled);
  };
  return (
    <ScrollView>
      <Heading icon='arrow-left' component='Dash' size={22} text='प्रोफाइल' position={110}/>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:40}}>
        <Text style={styles.subHeading}>उपयोगकर्ता प्रोफाइल</Text>
        <View style={{display:'flex',alignItems:'center'}}>
          <Text>{text}</Text>
          <Switch 
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#10b981'}
              onValueChange={toggleSwitch}
              value={isEnabled}
          />
        </View>
      </View>
      <ProfileHindiForm />
      <FooterHindi />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    subHeading:{
        marginHorizontal:16,
        marginVertical:8,
        fontSize:28,
        fontWeight:'600',
        color:'#000000'
    }
})