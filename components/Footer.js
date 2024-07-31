import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React from 'react';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export default function Footer() {
  const {t} =useTranslation();
  return (
    <View style={styles.support}>
        <Text style={styles.text}>{t('footer')}</Text>
        <Text style={styles.text}>support@example.com</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    support:{
        marginHorizontal:width*0.03,
        marginVertical:width*0.03
    },
    text:{
      color:'#666666'
    }
})