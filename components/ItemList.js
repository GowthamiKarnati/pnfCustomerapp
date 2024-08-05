import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React,{useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function ItemList({icon,text,color,component,mobileNumber}) {
    const navigation = useNavigation();

    const handlePress=()=>{
        navigation.navigate(component);
    }

  return (
    <TouchableOpacity onPress={handlePress}>
        <View style={[styles.ItemContainer,{backgroundColor:color}]}>
            <Icon style={styles.Itemicon} name={icon} size={28} color="$ffffff" />
            <Text style={styles.Itemtext}>{text}</Text>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    ItemContainer:{
        height:height*0.13,
        marginHorizontal:width*0.04,
        marginVertical:width*0.03,
        borderRadius:width*0.02,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    Itemicon:{
        color:'#ffffff',
        marginVertical:width*0.017,
    },
    Itemtext:{
        color:'#ffffff',
        fontSize:width*0.05,
        fontWeight:'600'
    }
})