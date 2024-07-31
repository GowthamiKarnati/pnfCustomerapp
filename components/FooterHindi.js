import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function FooterHindi() {
  return (
    <View style={styles.support}>
        <Text>सहायता चाहिए? समर्थन टीम से संपर्क करें:</Text>
        <Text>support@example.com</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    support:{
        marginHorizontal:12,
        marginVertical:12
    }
})