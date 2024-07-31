import { StyleSheet, Text, View,TouchableOpacity, Dimensions } from 'react-native'
import React from 'react';

const { width, height } = Dimensions.get('window');

export default function Button({text,width,onPress}) {
  return (
    <TouchableOpacity onPress={onPress} style={{display:'flex',justifyContent:'center',marginVertical:width*0.03}}>
      <View style={[styles.button, { width:width }]}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button:{
        backgroundColor:'#2563eb',
        borderRadius:width*0.02,
        marginVertical:width*0.02,
    },
    buttonText:{
        paddingVertical:width*0.03,
        paddingHorizontal:width*0.05,
        color:'#ffffff',
        fontSize:width*0.05,
        fontWeight:'400',
        textAlign:'center'
    }
})