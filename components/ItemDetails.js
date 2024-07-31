import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React from 'react'
const { width, height } = Dimensions.get('window');

export default function ItemDetails({text1,text2,style}) {
  return (
    <View style={styles.item}>
      <Text style={{fontSize:width*0.03,color:'#222222',fontWeight:style}}>{text1}</Text>
      <Text style={{fontSize:width*0.04,fontWeight:400,color:'#000000'}}>{text2}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    item:{
        paddingVertical:width*0.026
    }
})