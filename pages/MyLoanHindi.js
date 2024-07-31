import { StyleSheet, Text, View,Switch } from 'react-native'
import React,{useState} from 'react'
import Heading from '../components/Heading';
import DebtForm from '../components/DebtForm';
import FooterHindi from '../components/FooterHindi';
import { useNavigation,useRoute } from '@react-navigation/native';

export default function MyLoanHindi() {
    const [isEnabled, setIsEnabled] = useState(true);
    const [text, setText] = useState('Hindi');
    const navigation = useNavigation();
    const route = useRoute();

    const toggleSwitch = () => {
        const nextText = isEnabled ? 'Hindi' : 'English';
        setText(nextText);
        navigation.navigate('MyLoan', {isEnabled: !isEnabled, text: nextText });
        setIsEnabled(!isEnabled);
    };
  return (
    <View>
      <Heading icon='arrow-left' component='Dash' size={22} text='मेरे ऋण' position={100} />
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:40}}>
        <Text style={styles.subHeading}>मेरे ऋण</Text>
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
      <DebtForm loanid='ऋण ID: 123456' status='स्थिति' payStatus='भुगतान हो गया' amount='राशि: $10,000' date1='ऋण तिथि: 2023-12-01' date2='निर्धारित भुगतान तिथि: 2024-01-01' color='#10b981' />
      <DebtForm loanid='ऋण ID: 789012' status='स्थिति' payStatus='भुगतान नहीं हुआ' amount='राशि: $15,000' date1='ऋण तिथि: 2023-11-15' date2='निर्धारित भुगतान तिथि: 2024-01-15' color='#ef4444' />
      <FooterHindi />
    </View>
  )
}

const styles = StyleSheet.create({
    subHeading:{
        marginHorizontal:16,
        marginVertical:8,
        fontSize:26,
        fontWeight:'500',
        color:'#000000'
    }
})