import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function StartPage() {
  return (
    <View style={{backgroundColor:'#10b981',flex:1,justifyContent:'center',alignItems:'center'}}>
      <Image source={require('../Image/Pnf.jpg')} style={{width:200,height:200,borderRadius:100}} />
    </View>
  )
}

const styles = StyleSheet.create({})