import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Dimensions, Image } from 'react-native';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const CustomAlert = ({ isVisible, message1,message2, onClose }) => {
  const {t} =useTranslation();
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image source={require('../Image/Kyc.jpg')} style={styles.image} />
        </View>
        <Text style={styles.message1}>{message1}</Text>
        <Text style={styles.message2}>{message2}</Text>
        <TouchableOpacity onPress={onClose} style={styles.buttonContainer}>
          <Text style={styles.button}>{t('ok')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#dddddd', 
        padding: 20,
        borderRadius:width*0.02
    },
    message1:{
        fontSize:width*0.06,
        fontWeight:'600',
        color:'#444444',
        textAlign:'center',
        padding:width*0.01
    },
    message2:{
        fontSize:width*0.044,
        color:'#777777',
        textAlign:'center',
        padding:width*0.01
    },
    buttonContainer:{
        marginTop:width*0.028,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    button:{
        color:'#eeeeee',
        backgroundColor:'#1470D1',
        borderRadius:width*0.02,
        paddingHorizontal:width*0.04,
        paddingVertical:width*0.02,
        textAlign:'center'
    },
    imageContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    image:{
        width:width*0.12,
        height:width*0.12,
        borderRadius:width*0.06,
    }
})

export default CustomAlert;
