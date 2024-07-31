import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export default function TruckList({vehicleData}) {
    const {t} =useTranslation();
    // console.log("Vehicle Data",vehicleData);
  return (
    <View>
        <View style={styles.container}>
            <View style={styles.headingRow}>
                <Text style={[styles.headingText, { width: width*0.26 }]}>{t('vehiclenum')}</Text>
                <Text style={[styles.headingText, { width: width*0.24 }]}>{t('registrationdate')}</Text>
                <Text style={[styles.headingText, { width: width*0.24 }]}>{t('insuranceexpiry')}</Text>
            </View>
            {vehicleData.length ===0 ? (
                <>
                <View style={styles.box}>
                    <Text style={styles.text}>{t('noprofile')}</Text>
                </View>
                </>
            ):(
            vehicleData && vehicleData.map((data, index) => (
                <View key={index} style={styles.row}>
                    <Text style={[styles.rowText, { width: width*0.26 }]}>{data['Vehicle No.']}</Text>
                    <Text style={[styles.rowText, { width: width*0.24 }]}>{data['Registration Date'].split(" ")[0]}</Text>
                    <Text style={[styles.rowText, { width: width*0.24 }]}>{data['Insurance Expiry Date'].split(" ")[0]}</Text>
                </View>
            ))
            )}
        </View>
    </View>
      )
    }

const styles = StyleSheet.create({
    container:{
        borderWidth:width*0.0019,
        borderColor:"#d5d5d5",
        marginTop:width*0.03,
        marginHorizontal:width*0.03,
        marginBottom:width*0.04
    },
    headingRow:{
        flexDirection:'row',
        backgroundColor:'#e5e7eb',
        padding:width*0.03,
        height:height*0.1,
        display:'flex',
        alignItems:'center'
    },
    headingText:{
        fontSize:width*0.038,
        color:'#000000',
        fontWeight:'500',
        textAlign:'center',
        marginHorizontal:width*0.03
    },
    row:{
        flexDirection:'row',
        padding:width*0.03,
        height:height*0.09,
        display:'flex',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#d5d5d5'
    },
    rowText:{
        fontSize:width*0.035,
        color:'#222222',
        textAlign:'center',
        marginHorizontal:width*0.026,
    },
    box:{
        marginVertical:width*0.03,
        marginHorizontal:width*0.038,
        backgroundColor:'#FD3B28',
        padding:width*0.03,
        borderRadius:width*0.018,
        elevation:width*0.015
      },
      text:{
        textAlign:'center',
        fontSize:width*0.04,
        color:"#ffffff"
      },
})