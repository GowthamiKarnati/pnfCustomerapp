import { StyleSheet, Text, TouchableOpacity, View,Dimensions } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../pages/AuthContext';

const { width, height } = Dimensions.get('window');

export default function DashHeading({icon,text,size,component,mobileNumber}) {
    //console.log("Profile",profile);
    //console.log("mobile", mobileNumber)
    const {state,handleLogout,resetLoginData } = useAuth();
    const navigation = useNavigation();
    const handleProfilePress = () => {
        navigation.navigate(component,{mobileNumber}); 
    };
    
    const handleLogoutButton = async() => {
        await handleLogout(mobileNumber);
        await resetLoginData();
        navigation.navigate('Login');
    }
  return (
    <View style={styles.HeadingCont}>
        <View style={styles.headingbody}>
            <TouchableOpacity onPress={handleProfilePress}>
                <Icon name={icon} size={size} color="#ffffff" />
            </TouchableOpacity>
            <Text style={[styles.headingText]}>{text}</Text>
            <TouchableOpacity onPress={handleLogoutButton}>
                <Icon name="sign-out" size={24} color="#ffffff" />
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    HeadingCont:{
        backgroundColor:'#10b981',
        height:height*0.1,
        display:'flex',
        justifyContent:'center',
        marginBottom:width*0.05
    },
    headingbody:{
        flexDirection:'row',
        alignItems:'center',
        marginHorizontal:width*0.03,
        justifyContent:'space-between'
    },
    headingText:{
        fontSize:width*0.069,
        fontWeight:'400',
        color:'#ffffff',
        paddingHorizontal:width*0.03,
    }
})