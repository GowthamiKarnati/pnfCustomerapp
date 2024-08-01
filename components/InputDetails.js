import { StyleSheet, Text, TextInput, View,Dimensions } from 'react-native'
import React from 'react'

const { width, height } = Dimensions.get('window');

export default function InputDetails({head,placeholder,value,onChangeText,placeholderTextColor}) {
  return (
    <View style={styles.Container}>
      <Text style={styles.headText}>{head}</Text>
      <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor={placeholderTextColor} value={value} onChangeText={onChangeText} />
    </View>
  )
}

const styles = StyleSheet.create({
    Container:{
        marginVertical:width*0.01
    },
    input:{
        borderWidth:width*0.004,
        borderRadius:width*0.03,
        padding:width*0.025,
        fontSize:width*0.05,
        color:'#000000',
        borderColor:'#dedede'
    },
    headText:{
        color:'#000000',
        fontSize:width*0.04,
        fontWeight:'500',
        marginVertical:width*0.007,
        marginLeft:width*0.02,
        marginBottom: height*0.01
    }
})