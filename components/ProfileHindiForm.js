import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ItemDetails from './ItemDetails'

export default function ProfileHindiForm() {
  return (
    <View style={styles.FormContainer}>
      <ItemDetails style='700' text1='नाम' text2='जॉन डो'/>
      <ItemDetails style='700' text1='पैन कार्ड' text2='ABCDE1234F'/>
      <ItemDetails style='700' text1='जन्म तिथि' text2='01-जनवरी-1990'/>
      <ItemDetails style='700' text1='मोबाइल नंबर' text2='9876543210'/>
      <ItemDetails style='700' text1='वैकल्पिक मोबाइल नंबर' text2='8765432109'/>
      <View>
        <Text style={{fontSize:14,color:'#222222',fontWeight:'700'}}>ट्रक</Text>
        <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={{fontSize:16,color:'#000000'}}>ट्रक नंबर 1</Text>
        </View>
        <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={{fontSize:16,color:'#000000'}}>ट्रक नंबर 2</Text>
        </View>
      </View>
      <ItemDetails style='700' text1='डीलर का नाम' text2='मुल्ला टायर्स'/>
    </View>
  )
}

const styles = StyleSheet.create({
    FormContainer:{
        backgroundColor:'#ffffff',
        marginHorizontal:22,
        marginVertical:10,
        borderRadius:8,
        padding:24,
        elevation:8,
    },
    listItem:{
        flexDirection:'row',
        alignItems:'center',
        overflow:'hidden'
    },
    bullet:{
        fontSize:24,
        marginRight:12,
        color:'#000000'
    }
})